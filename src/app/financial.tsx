import { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    TextInput,
    Modal as RNModal,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Header } from "../components/Header";
import { NavbarGestao } from "../components/Navbar";
import Modal from "../components/Modal";
import api from "../services/api";
import { CARD_SHADOW } from "../styles/shadow";

type Status = "confirmado" | "agendado" | "concluído" | "cancelado" | "reagendado" | "em atendimento";
type TransactionType = "receita" | "despesa";

interface AppointmentEntry {
    kind: "appointment";
    id: string;
    date: Date;
    time: string;
    client: string;
    service: string;
    value: number;
    status: Status;
    paid: boolean;
}

interface ManualEntry {
    kind: "manual";
    id: string;
    date: Date;
    description: string;
    value: number;
    type: TransactionType;
}

type FinanceEntry = AppointmentEntry | ManualEntry;

const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const WEEKDAYS_FULL = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const MONTH_ABBR = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const MONTH_NAMES_FULL = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

const STATUS_STYLES: Record<Status, { label: string; color: string; bg: string }> = {
    confirmado: { label: "Confirmado", color: "#059669", bg: "#D1FAE5" },
    agendado: { label: "Agendado", color: "#1E3A8A", bg: "#DBEAFE" },
    concluído: { label: "Recebido", color: "#059669", bg: "#D1FAE5" },
    cancelado: { label: "Cancelado", color: "#DC2626", bg: "#FEE2E2" },
    reagendado: { label: "Reagendado", color: "#D97706", bg: "#FEF3C7" },
    "em atendimento": { label: "Em andamento", color: "#7C3AED", bg: "#EDE9FE" },
};

const TRANSACTION_TYPE_STYLES: Record<TransactionType, { label: string; color: string; bg: string }> = {
    receita: { label: "Receita", color: "#059669", bg: "#D1FAE5" },
    despesa: { label: "Despesa", color: "#DC2626", bg: "#FEE2E2" },
};

const fmtCurrency = (v: number) =>
    "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatCentsToBRL = (cents: number): string =>
    "R$ " + (cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const maskCurrencyInput = (text: string): string => {
    const digits = text.replace(/\D/g, '');
    if (!digits) return '';
    return formatCentsToBRL(Number(digits));
};

const parseCurrencyInput = (text: string): number => Number(text.replace(/\D/g, '')) / 100 || 0;

// "Status" descreve se o atendimento aconteceu; "paid" descreve se o
// dinheiro entrou. São coisas independentes e o pagamento pode ser
// confirmado em qualquer status (ex: cliente que paga adiantado).
const getAppointmentBadge = (entry: AppointmentEntry): { label: string; color: string; bg: string } => {
    if (entry.paid) {
        return { label: "Recebido", color: "#059669", bg: "#D1FAE5" };
    }
    if (entry.status === "concluído") {
        return { label: "A receber", color: "#D97706", bg: "#FEF3C7" };
    }
    return STATUS_STYLES[entry.status];
};

const mapEntry = (a: any): AppointmentEntry => ({
    kind: "appointment",
    id: a._id,
    date: new Date(a.date),
    time: a.time,
    client: a.clientName,
    service: a.serviceName,
    value: a.value,
    status: a.status,
    paid: !!a.paid,
});

const mapTransaction = (a: any): ManualEntry => ({
    kind: "manual",
    id: a._id,
    date: new Date(a.date),
    description: a.description,
    value: a.value,
    type: a.type,
});

const entryTime = (entry: FinanceEntry) => (entry.kind === "appointment" ? entry.time : "");

function TransactionFormModal({
    visible,
    onClose,
    onSave,
    year,
    month,
    daysInMonth,
    defaultDay,
    mode,
    initialData,
    initialType,
}: {
    visible: boolean;
    onClose: () => void;
    onSave: (data: { description: string; value: number; type: TransactionType; day: number }) => void;
    year: number;
    month: number;
    daysInMonth: number;
    defaultDay: number;
    mode: "create" | "edit";
    initialData?: ManualEntry;
    initialType?: TransactionType;
}) {
    const [type, setType] = useState<TransactionType>("receita");
    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');
    const [day, setDay] = useState(defaultDay);

    useEffect(() => {
        if (visible && mode === "edit" && initialData) {
            setType(initialData.type);
            setDescription(initialData.description);
            setValue(formatCentsToBRL(Math.round(initialData.value * 100)));
            setDay(initialData.date.getUTCDate());
        } else if (visible && mode === "create") {
            setType(initialType || "receita");
            setDescription('');
            setValue('');
            setDay(defaultDay);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, mode, initialData, defaultDay, initialType]);

    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
    const calendarCells: (number | null)[] = [
        ...Array(firstWeekday).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    const save = () => {
        const parsedValue = parseCurrencyInput(value);
        if (!description || !parsedValue) return;
        onSave({ description, value: parsedValue, type, day });
        onClose();
    };

    return (
        <RNModal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
                <TouchableOpacity className="flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }} onPress={onClose} />
                <View className="bg-surface p-6" style={{ elevation: 12 }}>
                    <View className="flex-row justify-between items-center mb-5">
                        <Text className="text-lg font-semibold text-primary">
                            {mode === "edit" ? "Editar Transação" : "Nova Transação"}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-xs text-gray-500 mb-1.5 font-medium">Tipo</Text>
                    <View className="flex-row mb-3" style={{ gap: 8 }}>
                        {(["receita", "despesa"] as TransactionType[]).map(option => {
                            const style = TRANSACTION_TYPE_STYLES[option];
                            const isActive = type === option;
                            return (
                                <TouchableOpacity
                                    key={option}
                                    onPress={() => setType(option)}
                                    className="flex-1 rounded-xl items-center py-3"
                                    style={{ backgroundColor: isActive ? style.color : style.bg }}
                                >
                                    <Text style={{ color: isActive ? "#fff" : style.color, fontSize: 13, fontWeight: "700" }}>
                                        {style.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <Text className="text-xs text-gray-500 mb-1.5 font-medium">Descrição</Text>
                    <TextInput
                        className="bg-background rounded-xl px-4 py-3 text-sm text-inputText mb-3"
                        value={description}
                        onChangeText={setDescription}
                    />

                    <Text className="text-xs text-gray-500 mb-1.5 font-medium">Valor</Text>
                    <TextInput
                        className="bg-background rounded-xl px-4 py-3 text-sm text-inputText mb-3"
                        placeholder="R$ 0,00"
                        keyboardType="numeric"
                        value={value}
                        onChangeText={(t) => setValue(maskCurrencyInput(t))}
                    />

                    <Text className="text-xs text-gray-500 mb-1.5 font-medium">Dia</Text>
                    <View
                        className="rounded-2xl p-3 mb-5"
                        style={{ backgroundColor: "#F5F6F8", borderWidth: 1, borderColor: "#E5E7EB" }}
                    >
                        <Text className="text-xs font-semibold text-primary mb-2 text-center" style={{ textTransform: "capitalize" }}>
                            {MONTH_NAMES_FULL[month]} de {year}
                        </Text>
                        <View className="flex-row mb-1">
                            {WEEKDAYS.map(w => (
                                <View key={w} style={{ width: `${100 / 7}%` }} className="items-center">
                                    <Text className="text-xs text-gray-400 font-medium">{w}</Text>
                                </View>
                            ))}
                        </View>
                        <View className="flex-row flex-wrap">
                            {calendarCells.map((cellDay, i) => {
                                const isSelected = cellDay === day;
                                return (
                                    <View key={i} style={{ width: `${100 / 7}%` }} className="items-center mb-2">
                                        {cellDay ? (
                                            <TouchableOpacity
                                                onPress={() => setDay(cellDay)}
                                                className="items-center justify-center"
                                                style={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: 16,
                                                    backgroundColor: isSelected ? "#1E3A8A" : "transparent",
                                                }}
                                            >
                                                <Text className={isSelected ? "text-white font-bold" : "text-inputText"} style={{ fontSize: 13 }}>
                                                    {cellDay}
                                                </Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <View style={{ width: 32, height: 32 }} />
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    <TouchableOpacity className="bg-primary py-4 rounded-2xl items-center" onPress={save}>
                        <Text className="text-white font-semibold text-base">
                            {mode === "edit" ? "Salvar Alterações" : "Salvar Transação"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </RNModal>
    );
}

function EditValueModal({
    entry,
    onClose,
    onSave,
}: {
    entry: AppointmentEntry | null;
    onClose: () => void;
    onSave: (entry: AppointmentEntry, value: number) => void;
}) {
    const [value, setValue] = useState('');

    useEffect(() => {
        if (entry) {
            setValue(formatCentsToBRL(Math.round(entry.value * 100)));
        }
    }, [entry]);

    const save = () => {
        if (!entry) return;
        const parsedValue = parseCurrencyInput(value);
        if (!parsedValue) return;
        onSave(entry, parsedValue);
        onClose();
    };

    return (
        <RNModal visible={!!entry} animationType="slide" transparent onRequestClose={onClose}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
                <TouchableOpacity className="flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }} onPress={onClose} />
                <View className="bg-surface p-6" style={{ elevation: 12 }}>
                    <View className="flex-row justify-between items-center mb-1">
                        <Text className="text-lg font-semibold text-primary">Editar Valor</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-xs text-gray-400 mb-5">{entry?.client}</Text>

                    <Text className="text-xs text-gray-500 mb-1.5 font-medium">Valor</Text>
                    <TextInput
                        className="bg-background rounded-xl px-4 py-3 text-sm text-inputText mb-5"
                        placeholder="R$ 0,00"
                        keyboardType="numeric"
                        value={value}
                        onChangeText={(t) => setValue(maskCurrencyInput(t))}
                    />

                    <TouchableOpacity className="bg-primary py-4 rounded-2xl items-center" onPress={save}>
                        <Text className="text-white font-semibold text-base">Salvar</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </RNModal>
    );
}

function AppointmentActionSheet({
    entry,
    onClose,
    onEdit,
    onConfirmPayment,
    onMarkPending,
}: {
    entry: AppointmentEntry | null;
    onClose: () => void;
    onEdit: (entry: AppointmentEntry) => void;
    onConfirmPayment: (entry: AppointmentEntry) => void;
    onMarkPending: (entry: AppointmentEntry) => void;
}) {
    if (!entry) return null;

    return (
        <RNModal visible={!!entry} transparent animationType="fade" onRequestClose={onClose}>
            <TouchableOpacity
                className="flex-1 justify-end"
                style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableOpacity activeOpacity={1} onPress={() => {}}>
                    <View className="bg-surface p-4" style={{ elevation: 12 }}>
                        <Text className="text-xs text-gray-400 px-2 mb-1">{entry.client}</Text>
                        <Text className="text-sm font-semibold text-inputText px-2 mb-3">{fmtCurrency(entry.value)}</Text>

                        {!entry.paid ? (
                            <TouchableOpacity
                                className="flex-row items-center px-2 py-3"
                                onPress={() => { onConfirmPayment(entry); onClose(); }}
                            >
                                <Ionicons name="checkmark-circle-outline" size={18} color="#059669" />
                                <Text className="text-sm ml-3" style={{ color: "#059669" }}>Confirmar pagamento recebido</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                className="flex-row items-center px-2 py-3"
                                onPress={() => { onMarkPending(entry); onClose(); }}
                            >
                                <Ionicons name="time-outline" size={18} color="#D97706" />
                                <Text className="text-sm ml-3" style={{ color: "#D97706" }}>Marcar como pagamento pendente</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            className="flex-row items-center px-2 py-3"
                            onPress={() => { onEdit(entry); onClose(); }}
                        >
                            <Ionicons name="pencil-outline" size={18} color="#1F2937" />
                            <Text className="text-sm text-inputText ml-3">Editar valor</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="items-center py-3 mt-1"
                            style={{ borderTopWidth: 1, borderTopColor: "#E5E7EB" }}
                            onPress={onClose}
                        >
                            <Text className="text-sm text-gray-400">Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </RNModal>
    );
}

function TransactionActionSheet({
    entry,
    onClose,
    onEdit,
    onDelete,
}: {
    entry: ManualEntry | null;
    onClose: () => void;
    onEdit: (entry: ManualEntry) => void;
    onDelete: (entry: ManualEntry) => void;
}) {
    if (!entry) return null;

    return (
        <RNModal visible={!!entry} transparent animationType="fade" onRequestClose={onClose}>
            <TouchableOpacity
                className="flex-1 justify-end"
                style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableOpacity activeOpacity={1} onPress={() => {}}>
                    <View className="bg-surface p-4" style={{ elevation: 12 }}>
                        <Text className="text-xs text-gray-400 px-2 mb-1">{entry.description}</Text>
                        <Text className="text-sm font-semibold text-inputText px-2 mb-3">{fmtCurrency(entry.value)}</Text>

                        <TouchableOpacity
                            className="flex-row items-center px-2 py-3"
                            onPress={() => { onEdit(entry); onClose(); }}
                        >
                            <Ionicons name="pencil-outline" size={18} color="#1F2937" />
                            <Text className="text-sm text-inputText ml-3">Editar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-row items-center px-2 py-3"
                            onPress={() => { onDelete(entry); onClose(); }}
                        >
                            <Ionicons name="trash-outline" size={18} color="#DC2626" />
                            <Text className="text-sm ml-3" style={{ color: "#DC2626" }}>Excluir</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="items-center py-3 mt-1"
                            style={{ borderTopWidth: 1, borderTopColor: "#E5E7EB" }}
                            onPress={onClose}
                        >
                            <Text className="text-sm text-gray-400">Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </RNModal>
    );
}

export default function Financeiro() {
    const params = useLocalSearchParams<{ new?: string }>();
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const defaultDay = today.getDate();

    const [appointmentEntries, setAppointmentEntries] = useState<AppointmentEntry[]>([]);
    const [manualEntries, setManualEntries] = useState<ManualEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [editingEntry, setEditingEntry] = useState<AppointmentEntry | null>(null);
    const [actionSheetEntry, setActionSheetEntry] = useState<AppointmentEntry | null>(null);
    const [paymentConfirmedVisible, setPaymentConfirmedVisible] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<ManualEntry | null>(null);
    const [transactionActionSheetEntry, setTransactionActionSheetEntry] = useState<ManualEntry | null>(null);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            api.get('/appointments', { params: { year, month } }),
            api.get('/transactions', { params: { year, month } }),
        ])
            .then(([appointmentsRes, transactionsRes]) => {
                setAppointmentEntries(appointmentsRes.data.map(mapEntry));
                setManualEntries(transactionsRes.data.map(mapTransaction));
            })
            .catch(() => setErrorModalVisible(true))
            .finally(() => setLoading(false));
    }, [year, month]);

    const saveAppointmentValue = async (entry: AppointmentEntry, value: number) => {
        try {
            await api.put(`/appointments/${entry.id}`, { value });
            setAppointmentEntries(prev => prev.map(e => (e.id === entry.id ? { ...e, value } : e)));
            // Volta pro action sheet, já com o valor atualizado, pra confirmar o pagamento ou não.
            setActionSheetEntry({ ...entry, value });
        } catch {
            setErrorModalVisible(true);
        }
    };

    const confirmPayment = async (entry: AppointmentEntry) => {
        try {
            await api.put(`/appointments/${entry.id}`, { paid: true });
            setAppointmentEntries(prev => prev.map(e => (e.id === entry.id ? { ...e, paid: true } : e)));
            setPaymentConfirmedVisible(true);
        } catch {
            setErrorModalVisible(true);
        }
    };

    const markPending = async (entry: AppointmentEntry) => {
        try {
            await api.put(`/appointments/${entry.id}`, { paid: false });
            setAppointmentEntries(prev => prev.map(e => (e.id === entry.id ? { ...e, paid: false } : e)));
        } catch {
            setErrorModalVisible(true);
        }
    };

    const openNewTransaction = () => {
        setEditingTransaction(null);
        setShowTransactionModal(true);
    };

    const openEditTransaction = (entry: ManualEntry) => {
        setEditingTransaction(entry);
        setShowTransactionModal(true);
    };

    // Atalhos "+ Nova Receita" / "+ Nova Despesa" da Home navegam pra cá com ?new=receita|despesa.
    const quickCreateType = params.new === "despesa" || params.new === "receita" ? params.new : undefined;
    useEffect(() => {
        if (quickCreateType) {
            openNewTransaction();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quickCreateType]);

    const saveTransaction = async (data: { description: string; value: number; type: TransactionType; day: number }) => {
        try {
            const isoDate = new Date(Date.UTC(year, month, data.day)).toISOString();
            if (editingTransaction) {
                const response = await api.put(`/transactions/${editingTransaction.id}`, {
                    description: data.description,
                    value: data.value,
                    type: data.type,
                    date: isoDate,
                });
                const updated = mapTransaction(response.data);
                setManualEntries(prev => prev.map(e => (e.id === updated.id ? updated : e)));
            } else {
                const response = await api.post('/transactions', {
                    description: data.description,
                    value: data.value,
                    type: data.type,
                    date: isoDate,
                });
                setManualEntries(prev => [...prev, mapTransaction(response.data)]);
            }
        } catch {
            setErrorModalVisible(true);
        }
    };

    const deleteTransaction = async (entry: ManualEntry) => {
        try {
            await api.delete(`/transactions/${entry.id}`);
            setManualEntries(prev => prev.filter(e => e.id !== entry.id));
        } catch {
            setErrorModalVisible(true);
        }
    };

    const { received, pending, despesas, total, dayTotal, sorted } = useMemo(() => {
        const entries: FinanceEntry[] = [...appointmentEntries, ...manualEntries];

        const isToday = (d: Date) =>
            d.getUTCDate() === today.getDate() &&
            d.getUTCMonth() === today.getMonth() &&
            d.getUTCFullYear() === today.getFullYear();

        const received = appointmentEntries
            .filter(e => e.paid)
            .reduce((sum, e) => sum + e.value, 0)
            + manualEntries.filter(e => e.type === "receita").reduce((sum, e) => sum + e.value, 0);

        const pending = appointmentEntries
            .filter(e => e.status === "concluído" && !e.paid)
            .reduce((sum, e) => sum + e.value, 0);

        const despesas = manualEntries
            .filter(e => e.type === "despesa")
            .reduce((sum, e) => sum + e.value, 0);

        const dayReceived = appointmentEntries
            .filter(e => e.paid && isToday(e.date))
            .reduce((sum, e) => sum + e.value, 0)
            + manualEntries.filter(e => e.type === "receita" && isToday(e.date)).reduce((sum, e) => sum + e.value, 0);

        const dayDespesas = manualEntries
            .filter(e => e.type === "despesa" && isToday(e.date))
            .reduce((sum, e) => sum + e.value, 0);

        const sorted = [...entries].sort((a, b) => {
            const dateDiff = b.date.getTime() - a.date.getTime();
            return dateDiff !== 0 ? dateDiff : entryTime(b).localeCompare(entryTime(a));
        });

        return { received, pending, despesas, total: received - despesas, dayTotal: dayReceived - dayDespesas, sorted };
    }, [appointmentEntries, manualEntries, today]);

    const groupedEntries: { key: string; date: Date; entries: FinanceEntry[] }[] = [];
    for (const entry of sorted) {
        const key = `${entry.date.getUTCFullYear()}-${entry.date.getUTCMonth()}-${entry.date.getUTCDate()}`;
        const lastGroup = groupedEntries[groupedEntries.length - 1];
        if (lastGroup && lastGroup.key === key) {
            lastGroup.entries.push(entry);
        } else {
            groupedEntries.push({ key, date: entry.date, entries: [entry] });
        }
    }

    return (
        <View className="flex-1 bg-background">
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                <View className="w-full max-w-md self-center px-6 pt-6">
                    {loading ? (
                        <View className="items-center py-10">
                            <ActivityIndicator size="large" color="#1E3A8A" />
                        </View>
                    ) : (
                        <>
                            <View className="bg-primary rounded-2xl p-5 mb-4">
                                <Text className="text-xs text-secondary font-medium mb-1" style={{ textTransform: "capitalize" }}>
                                    Saldo do Mês 
                                </Text>
                                <Text className="text-white text-3xl font-bold">{fmtCurrency(total)}</Text>
                            </View>

                            <View className="flex-row mb-5" style={{ gap: 10 }}>
                                <View className="flex-1 bg-primary rounded-2xl p-4">
                                    <Text className="text-xs text-secondary font-medium mb-1">Saldo do dia</Text>
                                    <Text className="text-white text-xl font-bold">{fmtCurrency(dayTotal)}</Text>
                                </View>
                                <TouchableOpacity
                                    className="flex-1 items-center justify-center border border-dashed border-primary rounded-2xl p-4"
                                    onPress={openNewTransaction}
                                >
                                    <Ionicons name="add-circle-outline" size={20} color="#1E3A8A" />
                                    <Text className="text-primary font-medium mt-1" style={{ fontSize: 13 }}>Nova Transação</Text>
                                </TouchableOpacity>
                            </View>

                            <View className="flex-row mb-5" style={{ gap: 10 }}>
                                <View className="flex-1 bg-surface rounded-2xl p-3.5" style={CARD_SHADOW}>
                                    <View className="flex-row items-center mb-2" style={{ gap: 5 }}>
                                        <Ionicons name="checkmark-circle-outline" size={15} color="#059669" />
                                        <Text className="text-[11px] text-gray-500 font-medium">Recebido</Text>
                                    </View>
                                    <Text className="text-base font-bold" style={{ color: "#059669" }}>{fmtCurrency(received)}</Text>
                                </View>

                                <View className="flex-1 bg-surface rounded-2xl p-3.5" style={CARD_SHADOW}>
                                    <View className="flex-row items-center mb-2" style={{ gap: 5 }}>
                                        <Ionicons name="time-outline" size={15} color="#D97706" />
                                        <Text className="text-[11px] text-gray-500 font-medium">A receber</Text>
                                    </View>
                                    <Text className="text-base font-bold" style={{ color: "#D97706" }}>{fmtCurrency(pending)}</Text>
                                </View>

                                <View className="flex-1 bg-surface rounded-2xl p-3.5" style={CARD_SHADOW}>
                                    <View className="flex-row items-center mb-2" style={{ gap: 5 }}>
                                        <Ionicons name="arrow-down-circle-outline" size={15} color="#DC2626" />
                                        <Text className="text-[11px] text-gray-500 font-medium">Despesas</Text>
                                    </View>
                                    <Text className="text-base font-bold" style={{ color: "#DC2626" }}>{fmtCurrency(despesas)}</Text>
                                </View>
                            </View>

                            <View className="flex-row items-center justify-between mb-3">
                                <Text className="text-base font-semibold text-inputText">Extrato</Text>
                                <Text className="text-xs text-gray-400">{sorted.length} lançamento{sorted.length === 1 ? '' : 's'}</Text>
                            </View>

                            {sorted.length === 0 ? (
                                <View className="bg-surface rounded-2xl p-8 items-center" style={CARD_SHADOW}>
                                    <Ionicons name="wallet-outline" size={40} color="#D1D5DB" />
                                    <Text className="text-gray-400 text-sm mt-2">Nenhuma movimentação neste mês</Text>
                                </View>
                            ) : (
                                groupedEntries.map(group => (
                                    <View key={group.key} className="mb-4">
                                        <Text className="text-xs font-semibold text-gray-500 mb-2" style={{ textTransform: "capitalize" }}>
                                            {WEEKDAYS_FULL[group.date.getUTCDay()]}, {group.date.getUTCDate()} de {MONTH_ABBR[group.date.getUTCMonth()]}
                                        </Text>

                                        {group.entries.map(entry => {
                                            if (entry.kind === "appointment") {
                                                const badge = getAppointmentBadge(entry);
                                                const badgeIcon = entry.paid
                                                    ? "checkmark-circle"
                                                    : (entry.status === "concluído" ? "time-outline" : null);
                                                return (
                                                    <View
                                                        key={entry.id}
                                                        className="flex-row items-center justify-between bg-surface rounded-2xl p-4 mb-3"
                                                        style={CARD_SHADOW}
                                                    >
                                                        <View className="flex-1">
                                                            <Text className="text-sm font-semibold text-inputText">{entry.client}</Text>
                                                            <Text className="text-xs text-gray-400 mt-0.5">Serviço: {entry.service}</Text>
                                                        </View>

                                                        <View className="items-end">
                                                            <View className="flex-row items-center mb-1" style={{ gap: 6 }}>
                                                                <Text className="text-sm font-bold text-inputText">{fmtCurrency(entry.value)}</Text>
                                                                <TouchableOpacity
                                                                    onPress={() => setActionSheetEntry(entry)}
                                                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                                                >
                                                                    <Ionicons name="ellipsis-vertical" size={16} color="#9CA3AF" />
                                                                </TouchableOpacity>
                                                            </View>
                                                            <View className="flex-row items-center rounded-full px-2 py-0.5" style={{ backgroundColor: badge.bg, gap: 3 }}>
                                                                {badgeIcon && <Ionicons name={badgeIcon} size={10} color={badge.color} />}
                                                                <Text style={{ color: badge.color, fontSize: 10, fontWeight: "700" }}>{badge.label}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                );
                                            }

                                            const typeStyle = TRANSACTION_TYPE_STYLES[entry.type];
                                            const sign = entry.type === "receita" ? "+ " : "− ";
                                            return (
                                                <View
                                                    key={entry.id}
                                                    className="flex-row items-center justify-between bg-surface rounded-2xl p-4 mb-3"
                                                    style={CARD_SHADOW}
                                                >
                                                    <View className="flex-1">
                                                        <Text className="text-sm font-semibold text-inputText">{entry.description}</Text>
                                                    </View>

                                                    <View className="items-end">
                                                        <View className="flex-row items-center mb-1" style={{ gap: 6 }}>
                                                            <Text className="text-sm font-bold" style={{ color: typeStyle.color }}>
                                                                {sign}{fmtCurrency(entry.value)}
                                                            </Text>
                                                            <TouchableOpacity
                                                                onPress={() => setTransactionActionSheetEntry(entry)}
                                                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                                            >
                                                                <Ionicons name="ellipsis-vertical" size={16} color="#9CA3AF" />
                                                            </TouchableOpacity>
                                                        </View>
                                                        <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: typeStyle.bg }}>
                                                            <Text style={{ color: typeStyle.color, fontSize: 10, fontWeight: "700" }}>{typeStyle.label}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    </View>
                                ))
                            )}
                        </>
                    )}
                </View>
            </ScrollView>

            <TransactionFormModal
                visible={showTransactionModal}
                onClose={() => { setShowTransactionModal(false); setEditingTransaction(null); }}
                onSave={saveTransaction}
                year={year}
                month={month}
                daysInMonth={daysInMonth}
                defaultDay={defaultDay}
                mode={editingTransaction ? "edit" : "create"}
                initialData={editingTransaction || undefined}
                initialType={quickCreateType}
            />

            <EditValueModal
                entry={editingEntry}
                onClose={() => setEditingEntry(null)}
                onSave={saveAppointmentValue}
            />

            <AppointmentActionSheet
                entry={actionSheetEntry}
                onClose={() => setActionSheetEntry(null)}
                onEdit={setEditingEntry}
                onConfirmPayment={confirmPayment}
                onMarkPending={markPending}
            />

            <TransactionActionSheet
                entry={transactionActionSheetEntry}
                onClose={() => setTransactionActionSheetEntry(null)}
                onEdit={openEditTransaction}
                onDelete={deleteTransaction}
            />

            <Modal
                isVisible={errorModalVisible}
                title="Erro"
                message="Não foi possível carregar os dados financeiros. Tente novamente."
                type="error"
                onClose={() => setErrorModalVisible(false)}
            />

            <Modal
                isVisible={paymentConfirmedVisible}
                title="Pagamento confirmado"
                message="Esse atendimento agora aparece como Recebido no Extrato."
                type="success"
                onClose={() => setPaymentConfirmedVisible(false)}
            />

            <NavbarGestao />
        </View>
    );
}
