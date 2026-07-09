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
} from "react-native";
import { NavbarGestao } from "../components/Navbar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { InputBase } from "../components/Input";
import Modal from "../components/Modal";
import api from "../services/api";

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
    status: "confirmado" | "agendado" | "concluído";
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
    confirmado: { label: "Confirmado", color: "#059669", bg: "#D1FAE5" },
    agendado: { label: "Agendado", color: "#1E3A8A", bg: "#DBEAFE" },
    concluído: { label: "Concluído", color: "#6B7280", bg: "#F3F4F6" },
};

const fmtCurrency = (v: number) =>
    "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatPhoneNumber = (value: string): string => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .substring(0, 15);
};

// --- Modal de Novo Agendamento ---
function NewAppointmentModal({
    visible,
    onClose,
    onSave,
    dayLabel,
    services,
    clients,
}: {
    visible: boolean;
    onClose: () => void;
    onSave: (appointment: Omit<Appointment, "id" | "day" | "status">) => void;
    dayLabel: string;
    services: ServiceOption[];
    clients: ClientOption[];
}) {
    const [client, setClient] = useState('');
    const [clientId, setClientId] = useState('');
    const [useClientCatalog, setUseClientCatalog] = useState(true);
    const [service, setService] = useState('');
    const [serviceId, setServiceId] = useState('');
    const [useCatalog, setUseCatalog] = useState(true);
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState('');
    const [phone, setPhone] = useState('');
    const [value, setValue] = useState('');

    const resetForm = () => {
        setClient('');
        setClientId('');
        setUseClientCatalog(true);
        setService('');
        setServiceId('');
        setUseCatalog(true);
        setTime('');
        setDuration('');
        setPhone('');
        setValue('');
    };

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
            setDuration(match.duration);
            setValue(String(match.value));
        }
    };

    const save = () => {
        if (!client || !service || !time || !value) return;
        onSave({
            client,
            clientId: clientId || undefined,
            service,
            serviceId: serviceId || undefined,
            time,
            duration: duration || '1h',
            phone,
            value: Number(value.replace(',', '.')) || 0,
        });
        resetForm();
        onClose();
    };

    return (
        <RNModal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
                <TouchableOpacity className="flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }} onPress={onClose} />
                <View className="bg-surface rounded-t-3xl p-6" style={{ elevation: 12 }}>
                    <View className="flex-row justify-between items-center mb-1">
                        <Text className="text-lg font-semibold text-primary">Novo Agendamento</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-xs text-gray-400 mb-5">{dayLabel}</Text>

                    <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 380 }}>
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
                            <View className="mb-1">
                                <InputBase
                                    label=""
                                    value={clientId}
                                    onChangeText={pickClient}
                                    options={clients.map(c => ({ label: `${c.name} — ${c.phone}`, value: c._id }))}
                                />
                            </View>
                        ) : (
                            <TextInput
                                className="bg-background border border-borderColor rounded-xl px-4 py-3 text-sm text-inputText mb-3"
                                placeholder="Nome do cliente"
                                value={client}
                                onChangeText={setClient}
                            />
                        )}

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
                            <View className="mb-1">
                                <InputBase
                                    label=""
                                    value={serviceId}
                                    onChangeText={pickService}
                                    options={services.map(s => ({ label: `${s.name} — ${fmtCurrency(s.value)}`, value: s._id }))}
                                />
                            </View>
                        ) : (
                            <TextInput
                                className="bg-background border border-borderColor rounded-xl px-4 py-3 text-sm text-inputText mb-3"
                                placeholder="Ex: Manicure, Corte, Pintura"
                                value={service}
                                onChangeText={setService}
                            />
                        )}

                        <View className="flex-row" style={{ gap: 10 }}>
                            <View className="flex-1">
                                <Text className="text-xs text-gray-500 mb-1.5 font-medium">Horário</Text>
                                <TextInput
                                    className="bg-background border border-borderColor rounded-xl px-4 py-3 text-sm text-inputText mb-3"
                                    placeholder="14:00"
                                    value={time}
                                    onChangeText={setTime}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs text-gray-500 mb-1.5 font-medium">Duração</Text>
                                <TextInput
                                    className="bg-background border border-borderColor rounded-xl px-4 py-3 text-sm text-inputText mb-3"
                                    placeholder="1h"
                                    value={duration}
                                    onChangeText={setDuration}
                                />
                            </View>
                        </View>

                        <Text className="text-xs text-gray-500 mb-1.5 font-medium">Telefone</Text>
                        <TextInput
                            className="bg-background border border-borderColor rounded-xl px-4 py-3 text-sm text-inputText mb-3"
                            placeholder="(84) 9 9999-0000"
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={(t) => setPhone(formatPhoneNumber(t))}
                        />

                        <Text className="text-xs text-gray-500 mb-1.5 font-medium">Valor (R$)</Text>
                        <TextInput
                            className="bg-background border border-borderColor rounded-xl px-4 py-3 text-sm text-inputText mb-5"
                            placeholder="0,00"
                            keyboardType="numeric"
                            value={value}
                            onChangeText={setValue}
                        />
                    </ScrollView>

                    <TouchableOpacity className="bg-primary py-4 rounded-2xl items-center mt-2" onPress={save}>
                        <Text className="text-white font-semibold text-base">Salvar Agendamento</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </RNModal>
    );
}

export default function Agenda() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [services, setServices] = useState<ServiceOption[]>([]);
    const [clients, setClients] = useState<ClientOption[]>([]);
    const [displayDate, setDisplayDate] = useState(new Date(2026, 6, 1));
    const [selectedDay, setSelectedDay] = useState(2);
    const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorModalVisible, setErrorModalVisible] = useState(false);

    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();

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
                const mapped: Appointment[] = res.data.map((a: any) => ({
                    id: a._id,
                    day: new Date(a.date).getUTCDate(),
                    time: a.time,
                    client: a.clientName,
                    clientId: a.client,
                    service: a.serviceName,
                    serviceId: a.service,
                    duration: a.duration,
                    phone: a.clientPhone || '',
                    value: a.value,
                    status: a.status,
                }));
                setAppointments(mapped);
            })
            .catch(() => setErrorModalVisible(true))
            .finally(() => setLoading(false));
    }, [year, month]);

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;

    const calendarCells: (number | null)[] = [
        ...Array(firstWeekday).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    const daysWithAppointments = new Set(appointments.map(a => a.day));

    const goToPrevMonth = () => setDisplayDate(new Date(year, month - 1, 1));
    const goToNextMonth = () => setDisplayDate(new Date(year, month + 1, 1));

    const dayAppointments = appointments
        .filter(a => a.day === selectedDay)
        .sort((a, b) => a.time.localeCompare(b.time));

    const dayTotal = dayAppointments.reduce((sum, a) => sum + a.value, 0);

    const addAppointment = async (data: Omit<Appointment, "id" | "day" | "status">) => {
        try {
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
            });
            const created = response.data;
            setAppointments(prev => [
                ...prev,
                {
                    id: created._id,
                    day: new Date(created.date).getUTCDate(),
                    time: created.time,
                    client: created.clientName,
                    clientId: created.client,
                    service: created.serviceName,
                    serviceId: created.service,
                    duration: created.duration,
                    phone: created.clientPhone || '',
                    value: created.value,
                    status: created.status,
                },
            ]);
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
                <View
                    className="mx-4 mb-5 bg-surface rounded-3xl p-4"
                    style={{ elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10 }}
                >
                    <View className="flex-row items-center justify-between mb-4 px-1">
                        <TouchableOpacity onPress={goToPrevMonth} className="p-1">
                            <Ionicons name="chevron-back" size={20} color="#374151" />
                        </TouchableOpacity>
                        <View className="flex-row" style={{ gap: 8 }}>
                            <View className="flex-row items-center bg-background rounded-lg px-3 py-1.5" style={{ gap: 4 }}>
                                <Text className="text-primary font-bold text-base">{MONTH_NAMES[month]}</Text>
                                <Ionicons name="chevron-down" size={14} color="#1E3A8A" />
                            </View>
                            <View className="flex-row items-center bg-background rounded-lg px-3 py-1.5" style={{ gap: 4 }}>
                                <Text className="text-primary font-bold text-base">{year}</Text>
                                <Ionicons name="chevron-down" size={14} color="#1E3A8A" />
                            </View>
                        </View>
                        <TouchableOpacity onPress={goToNextMonth} className="p-1">
                            <Ionicons name="chevron-forward" size={20} color="#374151" />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row mb-2">
                        {WEEKDAYS.map(day => (
                            <View key={day} style={{ width: `${100 / 7}%` }} className="items-center">
                                <Text className="text-xs text-gray-400 font-medium">{day}</Text>
                            </View>
                        ))}
                    </View>

                    <View className="flex-row flex-wrap">
                        {calendarCells.map((day, i) => {
                            const isSelected = day === selectedDay;
                            const hasAppointment = day !== null && daysWithAppointments.has(day);
                            return (
                                <View key={i} style={{ width: `${100 / 7}%` }} className="items-center mb-2">
                                    {day ? (
                                        <TouchableOpacity
                                            onPress={() => setSelectedDay(day)}
                                            className="items-center justify-center rounded-full"
                                            style={{ width: 34, height: 34, backgroundColor: isSelected ? "#1E3A8A" : "transparent" }}
                                        >
                                            <Text className={isSelected ? "text-white font-bold" : "text-inputText"}>{day}</Text>
                                            {hasAppointment && !isSelected && (
                                                <View
                                                    className="rounded-full bg-primary"
                                                    style={{ width: 4, height: 4, position: "absolute", bottom: 2 }}
                                                />
                                            )}
                                        </TouchableOpacity>
                                    ) : (
                                        <View style={{ width: 34, height: 34 }} />
                                    )}
                                </View>
                            );
                        })}
                    </View>
                </View>

                <View className="mx-4" style={{ paddingBottom: 100 }}>
                    {loading ? (
                        <View className="bg-surface rounded-2xl p-8 items-center" style={{ elevation: 1 }}>
                            <ActivityIndicator size="large" color="#1E3A8A" />
                        </View>
                    ) : dayAppointments.length === 0 ? (
                        <View className="bg-surface rounded-2xl p-8 items-center" style={{ elevation: 1 }}>
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

                                    <View
                                        className="flex-1 bg-surface rounded-2xl p-4"
                                        style={{
                                            elevation: 1,
                                            shadowColor: "#000",
                                            shadowOpacity: 0.05,
                                            shadowRadius: 6,
                                            borderLeftWidth: 3,
                                            borderLeftColor: status.color,
                                        }}
                                    >
                                        <View className="flex-row justify-between items-start mb-1">
                                            <Text className="text-base font-semibold text-inputText">{app.client}</Text>
                                            <View className="rounded-full px-2.5 py-0.5" style={{ backgroundColor: status.bg }}>
                                                <Text style={{ color: status.color, fontSize: 10, fontWeight: "700" }}>{status.label}</Text>
                                            </View>
                                        </View>
                                        <Text className="text-sm text-gray-400 mb-2">{app.service}</Text>
                                        <View className="flex-row justify-between items-center">
                                            <View className="flex-row items-center" style={{ gap: 10 }}>
                                                <View className="flex-row items-center" style={{ gap: 3 }}>
                                                    <Ionicons name="time-outline" size={13} color="#9CA3AF" />
                                                    <Text className="text-xs text-gray-400">{app.duration}</Text>
                                                </View>
                                                <View className="flex-row items-center" style={{ gap: 3 }}>
                                                    <Ionicons name="call-outline" size={13} color="#9CA3AF" />
                                                    <Text className="text-xs text-gray-400">{app.phone}</Text>
                                                </View>
                                            </View>
                                            <Text className="text-sm font-bold text-primary">{fmtCurrency(app.value)}</Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        })
                    )}
                </View>
            </ScrollView>

            <TouchableOpacity
                className="absolute items-center justify-center rounded-full bg-primary"
                style={{ width: 56, height: 56, right: 20, bottom: 84, elevation: 4, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 8 }}
                onPress={() => setShowNewAppointmentModal(true)}
            >
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>

            <NewAppointmentModal
                visible={showNewAppointmentModal}
                onClose={() => setShowNewAppointmentModal(false)}
                onSave={addAppointment}
                dayLabel={`Dia ${selectedDay} de ${MONTH_NAMES[month]} ${year}`}
                services={services}
                clients={clients}
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