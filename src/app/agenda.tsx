import { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Modal as RNModal,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    useWindowDimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { NavbarGestao } from "../components/Navbar";
import { Surface, IconButton, TouchableRipple } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { InputBase } from "../components/Input";
import Modal from "../components/Modal";
import api from "../services/api";
import { CARD_SHADOW } from "../styles/shadow";

interface Appointment {
    id: string;
    day: number;
    time: string;
    client: string;
    clientId?: string;
    service: string;
    serviceId?: string;
    duration: string;
    phone: string;
    value: number;
    status: "confirmado" | "agendado" | "concluído" | "cancelado" | "reagendado" | "em atendimento";
}

interface ServiceOption {
    _id: string;
    name: string;
    value: number;
    duration: string;
}

interface ClientOption {
    _id: string;
    name: string;
    phone: string;
}

const MONTH_NAMES = [
    "jan.", "fev.", "mar.", "abr.", "mai.", "jun.",
    "jul.", "ago.", "set.", "out.", "nov.", "dez.",
];

const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const STATUS_STYLES: Record<Appointment["status"], { label: string; color: string; bg: string }> = {
    agendado: { label: "Agendado", color: "#1E3A8A", bg: "#DBEAFE" },
    confirmado: { label: "Confirmado", color: "#059669", bg: "#D1FAE5" },
    reagendado: { label: "Reagendado", color: "#D97706", bg: "#FEF3C7" },
    cancelado: { label: "Cancelado", color: "#DC2626", bg: "#FEE2E2" },
    concluído: { label: "Concluído", color: "#6B7280", bg: "#F3F4F6" },
    "em atendimento": { label: "Em andamento", color: "#7C3AED", bg: "#EDE9FE" },
};

const MANUAL_STATUS_OPTIONS: { value: Appointment["status"]; label: string }[] = [
    { value: "agendado", label: "Agendado" },
    { value: "confirmado", label: "Confirmado" },
    { value: "reagendado", label: "Reagendado" },
    { value: "cancelado", label: "Cancelado" },
];

// Únicos valores aceitos pelo @IsIn do CreateAppointmentDto/UpdateAppointmentDto no backend.
// "concluído" e "em atendimento" são calculados automaticamente e nunca devem ser enviados.
const BACKEND_ACCEPTED_STATUSES = MANUAL_STATUS_OPTIONS.map(o => o.value);

const fmtCurrency = (v: number) =>
    "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatPhoneNumber = (value: string): string => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .substring(0, 15);
};

const formatCentsToBRL = (cents: number): string =>
    "R$ " + (cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const maskTimeInput = (text: string): string => {
    let digits = text.replace(/\D/g, '').substring(0, 4);
    if (digits.length >= 2) {
        const hh = Math.min(parseInt(digits.substring(0, 2), 10), 23);
        digits = String(hh).padStart(2, '0') + digits.substring(2);
    }
    if (digits.length >= 4) {
        const mm = Math.min(parseInt(digits.substring(2, 4), 10), 59);
        digits = digits.substring(0, 2) + String(mm).padStart(2, '0');
    }
    if (digits.length <= 2) return digits;
    return `${digits.substring(0, 2)}:${digits.substring(2)}`;
};

const timeToMinutes = (time: string): number => {
    const [h, m] = time.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
};

const maskCurrencyInput = (text: string): string => {
    const digits = text.replace(/\D/g, '');
    if (!digits) return '';
    return formatCentsToBRL(Number(digits));
};

const parseCurrencyInput = (text: string): number => Number(text.replace(/\D/g, '')) / 100 || 0;

// --- Modal de Novo Agendamento / Edição ---
function AppointmentFormModal({
    visible,
    onClose,
    onSave,
    dayLabel,
    services,
    clients,
    mode,
    initialData,
}: {
    visible: boolean;
    onClose: () => void;
    onSave: (appointment: Omit<Appointment, "id" | "day">) => void;
    dayLabel: string;
    services: ServiceOption[];
    clients: ClientOption[];
    mode: "create" | "edit";
    initialData?: Appointment;
}) {
    const { height: screenHeight } = useWindowDimensions();
    const modalHeight = screenHeight * 0.7;
    const [client, setClient] = useState('');
    const [clientId, setClientId] = useState('');
    const [useClientCatalog, setUseClientCatalog] = useState(true);
    const [service, setService] = useState('');
    const [serviceId, setServiceId] = useState('');
    const [useCatalog, setUseCatalog] = useState(true);
    const [time, setTime] = useState('');
    const [phone, setPhone] = useState('');
    const [value, setValue] = useState('');
    const [duration, setDuration] = useState('1h');
    const [status, setStatus] = useState<Appointment["status"]>('agendado');

    const resetForm = () => {
        setClient('');
        setClientId('');
        setUseClientCatalog(true);
        setService('');
        setServiceId('');
        setUseCatalog(true);
        setTime('');
        setPhone('');
        setValue('');
        setDuration('1h');
        setStatus('agendado');
    };

    useEffect(() => {
        if (visible && mode === "edit" && initialData) {
            setClient(initialData.client);
            setClientId(initialData.clientId || '');
            setUseClientCatalog(false);
            setService(initialData.service);
            setServiceId(initialData.serviceId || '');
            setUseCatalog(false);
            setTime(initialData.time);
            setPhone(initialData.phone);
            setValue(formatCentsToBRL(Math.round(initialData.value * 100)));
            setDuration(initialData.duration || '1h');
            setStatus(initialData.status);
        } else if (visible && mode === "create") {
            resetForm();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, mode, initialData]);

    const pickClient = (id: string) => {
        setClientId(id);
        const match = clients.find(c => c._id === id);
        if (match) {
            setClient(match.name);
            setPhone(match.phone);
        }
    };

    const pickService = (id: string) => {
        setServiceId(id);
        const match = services.find(s => s._id === id);
        if (match) {
            setService(match.name);
            setValue(formatCentsToBRL(Math.round(match.value * 100)));
            setDuration(match.duration || '1h');
        }
    };

    const save = () => {
        const parsedValue = parseCurrencyInput(value);
        if (!client || !service || !time || !parsedValue) return;
        onSave({
            client,
            clientId: clientId || undefined,
            service,
            serviceId: serviceId || undefined,
            time,
            duration: duration || '1h',
            phone,
            value: parsedValue,
            status,
        });
        resetForm();
        onClose();
    };

    return (
        <RNModal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
                <TouchableOpacity className="flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }} onPress={onClose} />
                <View className="bg-surface p-6" style={{ elevation: 12, height: modalHeight }}>
                    <View className="flex-row justify-between items-center mb-1">
                        <Text className="text-lg font-semibold text-primary">
                            {mode === "edit" ? "Editar Agendamento" : "Novo Agendamento"}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-xs text-gray-400 mb-4">{dayLabel}</Text>

                    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                        <View className="flex-row justify-between items-center mb-1.5">
                            <Text className="text-xs text-gray-500 font-medium">Cliente</Text>
                            {clients.length > 0 && (
                                <TouchableOpacity onPress={() => { setUseClientCatalog(!useClientCatalog); setClientId(''); setClient(''); setPhone(''); }}>
                                    <Text className="text-xs text-primary font-medium">
                                        {useClientCatalog ? "Digitar manualmente" : "Escolher da lista"}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        {useClientCatalog && clients.length > 0 ? (
                            <View className="mb-4">
                                <InputBase
                                    label=""
                                    value={clientId}
                                    onChangeText={pickClient}
                                    options={clients.map(c => ({ label: `${c.name} — ${c.phone}`, value: c._id }))}
                                />
                            </View>
                        ) : (
                            <TextInput
                                className="bg-background rounded-xl px-4 py-3 text-sm text-inputText mb-4"
                                autoCapitalize="characters"
                                value={client}
                                onChangeText={(t) => setClient(t.toUpperCase())}
                            />
                        )}

                        <Text className="text-xs text-gray-500 mb-1.5 font-medium">Telefone</Text>
                        <TextInput
                            className="bg-background rounded-xl px-4 py-3 text-sm text-inputText mb-4"
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={(t) => setPhone(formatPhoneNumber(t))}
                        />

                        <View className="flex-row justify-between items-center mb-1.5">
                            <Text className="text-xs text-gray-500 font-medium">Serviço</Text>
                            {services.length > 0 && (
                                <TouchableOpacity onPress={() => { setUseCatalog(!useCatalog); setServiceId(''); setService(''); }}>
                                    <Text className="text-xs text-primary font-medium">
                                        {useCatalog ? "Digitar manualmente" : "Escolher da lista"}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        {useCatalog && services.length > 0 ? (
                            <View className="mb-4">
                                <InputBase
                                    label=""
                                    value={serviceId}
                                    onChangeText={pickService}
                                    options={services.map(s => ({ label: `${s.name} — ${fmtCurrency(s.value)}`, value: s._id }))}
                                />
                            </View>
                        ) : (
                            <TextInput
                                className="bg-background rounded-xl px-4 py-3 text-sm text-inputText mb-4"
                                autoCapitalize="characters"
                                value={service}
                                onChangeText={(t) => setService(t.toUpperCase())}
                            />
                        )}

                        <Text className="text-xs text-gray-500 mb-1.5 font-medium">Valor</Text>
                        <TextInput
                            className="bg-background rounded-xl px-4 py-3 text-sm text-inputText mb-4"
                            placeholder="R$ 0,00"
                            keyboardType="numeric"
                            value={value}
                            onChangeText={(t) => setValue(maskCurrencyInput(t))}
                        />

                        <Text className="text-xs text-gray-500 mb-1.5 font-medium">Horário</Text>
                        <TextInput
                            className="bg-background rounded-xl px-4 py-3 text-sm text-inputText mb-4"
                            placeholder="00:00"
                            keyboardType="numeric"
                            maxLength={5}
                            value={time}
                            onChangeText={(t) => setTime(maskTimeInput(t))}
                        />

                        <Text className="text-xs text-gray-500 mb-1.5 font-medium">Status</Text>
                        <View className="flex-row flex-wrap mb-4" style={{ gap: 8 }}>
                            {MANUAL_STATUS_OPTIONS.map(option => {
                                const style = STATUS_STYLES[option.value];
                                const isActive = status === option.value;
                                return (
                                    <TouchableOpacity
                                        key={option.value}
                                        onPress={() => setStatus(option.value)}
                                        className="rounded-full px-3 py-1.5"
                                        style={{ backgroundColor: isActive ? style.color : style.bg }}
                                    >
                                        <Text style={{ color: isActive ? "#fff" : style.color, fontSize: 12, fontWeight: "700" }}>
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <View className="items-center mt-2">
                            <TouchableOpacity className="rounded-xl bg-secondary p-3 items-center" style={{ minWidth: 200 }} onPress={save}>
                                <Text className="text-primary font-semibold">
                                    {mode === "edit" ? "Salvar" : "Salvar Agendamento"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </RNModal>
    );
}

const mapAppointment = (a: any, fallbackDay?: number): Appointment => ({
    id: a._id,
    day: a.date ? new Date(a.date).getUTCDate() : (fallbackDay as number),
    time: a.time,
    client: a.clientName,
    clientId: a.client,
    service: a.serviceName,
    serviceId: a.service,
    duration: a.duration,
    phone: a.clientPhone || '',
    value: a.value,
    status: a.status,
});

export default function Agenda() {
    const params = useLocalSearchParams<{ new?: string }>();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [services, setServices] = useState<ServiceOption[]>([]);
    const [clients, setClients] = useState<ClientOption[]>([]);
    const [currentMonthDate, setCurrentMonthDate] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });
    const month = currentMonthDate.getMonth();
    const year = currentMonthDate.getFullYear();
    const [selectedDay, setSelectedDay] = useState(() => new Date().getDate());
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
    const [monthMenuVisible, setMonthMenuVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorModalVisible, setErrorModalVisible] = useState(false);

    useEffect(() => {
        api.get('/services')
            .then(res => setServices(res.data))
            .catch(() => setServices([]));
        api.get('/clients')
            .then(res => setClients(res.data))
            .catch(() => setClients([]));
    }, []);

    useEffect(() => {
        setLoading(true);
        api.get('/appointments', { params: { year, month } })
            .then(res => {
                setAppointments(res.data.map((a: any) => mapAppointment(a)));
            })
            .catch(() => setErrorModalVisible(true))
            .finally(() => setLoading(false));
    }, [year, month]);

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    type CalendarCell = { day: number; muted: boolean };

    const leadingCells: CalendarCell[] = Array.from({ length: firstWeekday }, (_, i) => ({
        day: daysInPrevMonth - firstWeekday + 1 + i,
        muted: true,
    }));
    const currentCells: CalendarCell[] = Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        muted: false,
    }));
    const trailingCount = (7 - ((leadingCells.length + currentCells.length) % 7)) % 7;
    const trailingCells: CalendarCell[] = Array.from({ length: trailingCount }, (_, i) => ({
        day: i + 1,
        muted: true,
    }));

    const calendarCells: CalendarCell[] = [...leadingCells, ...currentCells, ...trailingCells];

    const daysWithAppointments = new Set(appointments.map(a => a.day));

    const selectMonth = (nextMonth: number) => {
        const nextDate = new Date(year, nextMonth, 1);
        setCurrentMonthDate(nextDate);
        setSelectedDay(day => Math.min(day, new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate()));
    };
    const goToPrevMonth = () => selectMonth(month - 1);
    const goToNextMonth = () => selectMonth(month + 1);

    const dayAppointments = appointments
        .filter(a => a.day === selectedDay)
        .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));

    const dayTotal = dayAppointments
        .filter(a => a.status !== "cancelado" && a.status !== "reagendado")
        .reduce((sum, a) => sum + a.value, 0);

    const openCreateModal = () => {
        setEditingAppointment(null);
        setShowAppointmentModal(true);
    };

    // Atalho "+ Novo Agendamento" da Home navega pra cá com ?new=1.
    useEffect(() => {
        if (params.new) {
            openCreateModal();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.new]);

    const openEditModal = (appointment: Appointment) => {
        setEditingAppointment(appointment);
        setShowAppointmentModal(true);
    };

    const saveAppointment = async (data: Omit<Appointment, "id" | "day">) => {
        try {
            if (editingAppointment) {
                const response = await api.put(`/appointments/${editingAppointment.id}`, {
                    service: data.serviceId,
                    serviceName: data.service,
                    client: data.clientId,
                    clientName: data.client,
                    clientPhone: data.phone,
                    time: data.time,
                    duration: data.duration,
                    value: data.value,
                    // "concluído"/"em atendimento" são calculados pelo backend; enviá-los
                    // quebraria a validação (@IsIn) e derrubaria a edição inteira.
                    ...(BACKEND_ACCEPTED_STATUSES.includes(data.status) ? { status: data.status } : {}),
                });
                const updated = mapAppointment(response.data, editingAppointment.day);
                setAppointments(prev => prev.map(a => (a.id === editingAppointment.id ? updated : a)));
            } else {
                const isoDate = new Date(Date.UTC(year, month, selectedDay)).toISOString();
                const response = await api.post('/appointments', {
                    service: data.serviceId,
                    serviceName: data.service,
                    client: data.clientId,
                    clientName: data.client,
                    clientPhone: data.phone,
                    date: isoDate,
                    time: data.time,
                    duration: data.duration,
                    value: data.value,
                    status: data.status,
                });
                setAppointments(prev => [...prev, mapAppointment(response.data, selectedDay)]);
            }
        } catch (error) {
            setErrorModalVisible(true);
        }
    };

    return (
        <View className="flex-1 bg-background">
            <View className="flex-row justify-between items-center px-5 pt-6 pb-4">
                <Text className="text-2xl font-semibold text-inputText">Hoje</Text>
                <View className="flex-row items-center" style={{ gap: 14 }}>
                    <View className="flex-row items-center" style={{ gap: 4 }}>
                        <Ionicons name="calendar-outline" size={15} color="#6B7280" />
                        <Text className="text-sm text-gray-500">{dayAppointments.length} atendimentos</Text>
                    </View>
                    <View className="flex-row items-center" style={{ gap: 4 }}>
                        <Ionicons name="wallet-outline" size={15} color="#059669" />
                        <Text className="text-sm font-semibold" style={{ color: "#059669" }}>{fmtCurrency(dayTotal)}</Text>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <Surface
                    elevation={1}
                    style={{
                        marginHorizontal: 16,
                        marginBottom: 20,
                        borderRadius: 16,
                        padding: 16,
                        borderWidth: 1,
                        borderColor: "#E5E7EB",
                        backgroundColor: "#FFFFFF",
                    }}
                >
                    <View className="flex-row items-center justify-between mb-4">
                        <IconButton
                            icon={() => <Ionicons name="chevron-back" size={18} color="#374151" />}
                            size={20}
                            onPress={goToPrevMonth}
                        />
                        <View className="flex-row items-center" style={{ gap: 6 }}>
                            <TouchableRipple onPress={() => setMonthMenuVisible(true)} borderless style={{ borderRadius: 8 }}>
                                <View className="flex-row items-center px-2 py-1" style={{ gap: 2 }}>
                                    <Text className="text-inputText font-semibold text-base" style={{ textTransform: "capitalize" }}>
                                        {MONTH_NAMES[month]}
                                    </Text>
                                    <Ionicons name="chevron-down" size={14} color="#1E3A8A" />
                                </View>
                            </TouchableRipple>

                            <Text className="text-inputText font-semibold text-base">{year}</Text>
                        </View>
                        <IconButton
                            icon={() => <Ionicons name="chevron-forward" size={18} color="#374151" />}
                            size={20}
                            onPress={goToNextMonth}
                        />
                    </View>

                    <View className="flex-row mb-2">
                        {WEEKDAYS.map(day => (
                            <View key={day} style={{ width: `${100 / 7}%` }} className="items-center">
                                <Text className="text-xs text-gray-400 font-medium">{day}</Text>
                            </View>
                        ))}
                    </View>

                    <View className="flex-row flex-wrap">
                        {calendarCells.map((cell, i) => {
                            const isSelected = !cell.muted && cell.day === selectedDay;
                            const hasAppointment = !cell.muted && daysWithAppointments.has(cell.day);
                            return (
                                <View key={i} style={{ width: `${100 / 7}%` }} className="items-center mb-2">
                                    {cell.muted ? (
                                        <View className="items-center justify-center" style={{ width: 34, height: 34 }}>
                                            <Text style={{ color: "#D1D5DB" }}>{cell.day}</Text>
                                        </View>
                                    ) : (
                                        <TouchableRipple
                                            onPress={() => setSelectedDay(cell.day)}
                                            borderless
                                            style={{ width: 34, height: 34, borderRadius: 17 }}
                                        >
                                            <View
                                                className="items-center justify-center"
                                                style={{
                                                    width: 34,
                                                    height: 34,
                                                    borderRadius: 17,
                                                    borderWidth: isSelected ? 1.5 : 0,
                                                    borderColor: "#1E3A8A",
                                                }}
                                            >
                                                <Text className={isSelected ? "text-primary font-bold" : "text-inputText"}>{cell.day}</Text>
                                                {hasAppointment && !isSelected && (
                                                    <View
                                                        className="rounded-full bg-primary"
                                                        style={{ width: 4, height: 4, position: "absolute", bottom: 2 }}
                                                    />
                                                )}
                                            </View>
                                        </TouchableRipple>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                </Surface>

                <View className="mx-4 mb-5">
                    <TouchableOpacity
                        className="flex-row items-center justify-center border border-dashed border-primary rounded-2xl p-4"
                        onPress={openCreateModal}
                    >
                        <Ionicons name="add-circle-outline" size={20} color="#1E3A8A" />
                        <Text className="text-primary font-medium ml-2">Novo Agendamento</Text>
                    </TouchableOpacity>
                </View>

                <View className="mx-4" style={{ paddingBottom: 100 }}>
                    {loading ? (
                        <View className="bg-surface rounded-2xl p-8 items-center" style={CARD_SHADOW}>
                            <ActivityIndicator size="large" color="#1E3A8A" />
                        </View>
                    ) : dayAppointments.length === 0 ? (
                        <View className="bg-surface rounded-2xl p-8 items-center" style={CARD_SHADOW}>
                            <Ionicons name="calendar-outline" size={40} color="#D1D5DB" />
                            <Text className="text-gray-400 text-sm mt-2">Nenhum atendimento neste dia</Text>
                        </View>
                    ) : (
                        dayAppointments.map((app, i) => {
                            const status = STATUS_STYLES[app.status];
                            return (
                                <View key={app.id} className="flex-row mb-3" style={{ gap: 10 }}>
                                    <View className="items-center" style={{ width: 46 }}>
                                        <Text style={{ fontSize: 12, fontWeight: "700", color: "#1E3A8A" }}>{app.time}</Text>
                                        {i < dayAppointments.length - 1 && (
                                            <View style={{ flex: 1, width: 1.5, backgroundColor: "#E5E7EB", marginTop: 4, minHeight: 20 }} />
                                        )}
                                    </View>

                                    <TouchableOpacity
                                        className="flex-1 bg-surface rounded-2xl p-4"
                                        activeOpacity={0.7}
                                        onPress={() => openEditModal(app)}
                                        style={{
                                            ...CARD_SHADOW,
                                            borderLeftWidth: 3,
                                            borderLeftColor: status.color,
                                        }}
                                    >
                                        <View className="flex-row justify-between items-start mb-1">
                                            <Text className="text-base font-semibold text-inputText">{app.client}</Text>
                                            <View className="flex-row items-center" style={{ gap: 6 }}>
                                                <View className="rounded-full px-2.5 py-0.5" style={{ backgroundColor: status.bg }}>
                                                    <Text style={{ color: status.color, fontSize: 10, fontWeight: "700" }}>{status.label}</Text>
                                                </View>
                                                <TouchableOpacity
                                                    onPress={() => openEditModal(app)}
                                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                                >
                                                    <Ionicons name="ellipsis-vertical" size={16} color="#9CA3AF" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View className="flex-row items-center mb-2" style={{ gap: 3 }}>
                                            <Ionicons name="call-outline" size={13} color="#9CA3AF" />
                                            <Text className="text-xs text-gray-400">{app.phone}</Text>
                                        </View>
                                        <View className="flex-row justify-between items-center">
                                            <Text className="text-sm">
                                                <Text className="font-semibold text-inputText">Serviço: </Text>
                                                <Text className="text-gray-400">{app.service}</Text>
                                            </Text>
                                            <Text className="text-sm font-bold text-primary">{fmtCurrency(app.value)}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            );
                        })
                    )}
                </View>
            </ScrollView>

            <RNModal
                visible={monthMenuVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setMonthMenuVisible(false)}
            >
                <TouchableOpacity
                    className="flex-1 justify-center items-center px-10"
                    style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                    activeOpacity={1}
                    onPress={() => setMonthMenuVisible(false)}
                >
                    <TouchableOpacity activeOpacity={1} onPress={() => {}} style={{ width: "100%", maxWidth: 240 }}>
                        <View
                            className="bg-surface rounded-2xl"
                            style={{ elevation: 12, maxHeight: 340, overflow: "hidden" }}
                        >
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {MONTH_NAMES.map((name, i) => {
                                    const isActive = i === month;
                                    return (
                                        <TouchableOpacity
                                            key={name}
                                            onPress={() => { selectMonth(i); setMonthMenuVisible(false); }}
                                            className="px-5 py-3"
                                            style={{ backgroundColor: isActive ? "#DBEAFE" : "transparent" }}
                                        >
                                            <Text
                                                style={{
                                                    textTransform: "capitalize",
                                                    color: isActive ? "#1E3A8A" : "#1F2937",
                                                    fontWeight: isActive ? "700" : "400",
                                                }}
                                            >
                                                {name}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </RNModal>

            <AppointmentFormModal
                visible={showAppointmentModal}
                onClose={() => setShowAppointmentModal(false)}
                onSave={saveAppointment}
                dayLabel={`Dia ${selectedDay} de ${MONTH_NAMES[month]} ${year}`}
                services={services}
                clients={clients}
                mode={editingAppointment ? "edit" : "create"}
                initialData={editingAppointment || undefined}
            />

            <Modal
                isVisible={errorModalVisible}
                title="Erro"
                message="Não foi possível carregar ou salvar a agenda. Tente novamente."
                type="error"
                onClose={() => setErrorModalVisible(false)}
            />

            <NavbarGestao />
        </View>
    );
}
