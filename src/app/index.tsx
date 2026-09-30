import { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NavbarGestao } from "../components/Navbar";
import Modal from "../components/Modal";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { CARD_SHADOW } from "../styles/shadow";

type Status = "confirmado" | "agendado" | "concluído" | "cancelado" | "reagendado" | "em atendimento";
type TransactionType = "receita" | "despesa";

interface AppointmentEntry {
    id: string;
    date: Date;
    time: string;
    client: string;
    service: string;
    value: number;
    status: Status;
    paid: boolean;
}

interface TransactionEntry {
    date: Date;
    value: number;
    type: TransactionType;
}

const WEEKDAYS_FULL = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const MONTH_NAMES_FULL = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

const STATUS_COLORS: Record<Status, string> = {
    confirmado: "#059669",
    agendado: "#1E3A8A",
    concluído: "#6B7280",
    cancelado: "#DC2626",
    reagendado: "#D97706",
    "em atendimento": "#7C3AED",
};

const fmtCurrency = (v: number) =>
    "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtPercent = (v: number) => `${Math.round(v * 100)}%`;

const mapAppointment = (a: any): AppointmentEntry => ({
    id: a._id,
    date: new Date(a.date),
    time: a.time,
    client: a.clientName,
    service: a.serviceName,
    value: a.value,
    status: a.status,
    paid: !!a.paid,
});

const mapTransaction = (a: any): TransactionEntry => ({
    date: new Date(a.date),
    value: a.value,
    type: a.type,
});

const toDateTime = (a: AppointmentEntry) => {
    const [hh, mm] = a.time.split(':').map(Number);
    return new Date(a.date.getUTCFullYear(), a.date.getUTCMonth(), a.date.getUTCDate(), hh || 0, mm || 0);
};

function StatCard({ icon, iconColor, label, value }: { icon: keyof typeof Ionicons.glyphMap; iconColor: string; label: string; value: string }) {
    return (
        <View className="flex-1 bg-surface rounded-2xl p-3.5" style={CARD_SHADOW}>
            <View className="flex-row items-center mb-2" style={{ gap: 5 }}>
                <Ionicons name={icon} size={15} color={iconColor} />
                <Text className="text-[11px] text-gray-500 font-medium">{label}</Text>
            </View>
            <Text className="text-lg font-bold" style={{ color: iconColor }}>{value}</Text>
        </View>
    );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <View
            className="bg-surface rounded-2xl p-4 mb-4"
            style={CARD_SHADOW}
        >
            <Text className="text-base font-semibold text-inputText mb-3">{title}</Text>
            {children}
        </View>
    );
}

export default function Painel() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<AppointmentEntry[]>([]);
    const [transactions, setTransactions] = useState<TransactionEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorModalVisible, setErrorModalVisible] = useState(false);

    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();

    useEffect(() => {
        setLoading(true);
        Promise.all([
            api.get('/appointments', { params: { year: y, month: m } }),
            api.get('/transactions', { params: { year: y, month: m } }),
        ])
            .then(([appointmentsRes, transactionsRes]) => {
                setAppointments(appointmentsRes.data.map(mapAppointment));
                setTransactions(transactionsRes.data.map(mapTransaction));
            })
            .catch(() => setErrorModalVisible(true))
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const summary = useMemo(() => {
        const d = now.getDate();
        const dateKey = (dt: Date) => `${dt.getUTCFullYear()}-${dt.getUTCMonth()}-${dt.getUTCDate()}`;
        const todayKey = `${y}-${m}-${d}`;

        const todayAppointments = appointments
            .filter(a => dateKey(a.date) === todayKey)
            .sort((a, b) => a.time.localeCompare(b.time));
        const todayTransactions = transactions.filter(t => dateKey(t.date) === todayKey);

        const receitaHoje = todayAppointments.filter(a => a.paid).reduce((s, a) => s + a.value, 0)
            + todayTransactions.filter(t => t.type === "receita").reduce((s, t) => s + t.value, 0);
        const despesaHoje = todayTransactions.filter(t => t.type === "despesa").reduce((s, t) => s + t.value, 0);
        const saldoHoje = receitaHoje - despesaHoje;

        const proximo = todayAppointments
            .filter(a => a.status !== "cancelado")
            .map(a => ({ a, dt: toDateTime(a) }))
            .filter(x => x.dt.getTime() >= now.getTime())
            .sort((x, y2) => x.dt.getTime() - y2.dt.getTime())[0];

        const receitaMes = appointments.filter(a => a.paid).reduce((s, a) => s + a.value, 0)
            + transactions.filter(t => t.type === "receita").reduce((s, t) => s + t.value, 0);
        const despesaMes = transactions.filter(t => t.type === "despesa").reduce((s, t) => s + t.value, 0);
        const saldoMes = receitaMes - despesaMes;

        const concluidosMes = appointments.filter(a => a.status === "concluído").length;
        const canceladosMes = appointments.filter(a => a.status === "cancelado").length;
        const totalAgendadosMes = appointments.length;
        const taxaConclusao = totalAgendadosMes ? concluidosMes / totalAgendadosMes : 0;
        const receitaMedia = concluidosMes ? receitaMes / concluidosMes : 0;

        return {
            todayAppointments,
            todayCount: todayAppointments.length,
            receitaHoje,
            despesaHoje,
            saldoHoje,
            proximo,
            receitaMes,
            despesaMes,
            saldoMes,
            concluidosMes,
            canceladosMes,
            taxaConclusao,
            receitaMedia,
        };
    }, [appointments, transactions]);

    const hour = now.getHours();
    const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
    const firstName = user?.name?.split(' ')[0] || '';
    const dateLabel = `${WEEKDAYS_FULL[now.getDay()]}, ${now.getDate()} de ${MONTH_NAMES_FULL[m]}`;

    return (
        <View className="flex-1 bg-background">
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                <View className="w-full max-w-md self-center px-6">
                    {/* Saudação */}
                    <View className="pt-6 pb-4">
                        <Text className="text-sm text-gray-400" style={{ textTransform: "capitalize" }}>{dateLabel}</Text>
                        <Text className="text-2xl font-semibold text-inputText mt-1">
                            {greeting}{firstName ? `, ${firstName}` : ''}!
                        </Text>
                    </View>

                    {loading ? (
                        <View className="items-center py-10">
                            <ActivityIndicator size="large" color="#1E3A8A" />
                        </View>
                    ) : (
                        <>
                            {/* Resumo do dia */}
                            <View className="flex-row mb-3" style={{ gap: 10 }}>
                                <StatCard icon="calendar-outline" iconColor="#1E3A8A" label="Agendamentos" value={`${summary.todayCount} Hoje`} />
                                <StatCard icon="cash-outline" iconColor="#059669" label="Receita" value={fmtCurrency(summary.receitaHoje)} />
                            </View>
                            <View className="flex-row mb-5" style={{ gap: 10 }}>
                                <StatCard icon="arrow-down-circle-outline" iconColor="#DC2626" label="Despesas" value={fmtCurrency(summary.despesaHoje)} />
                                <StatCard icon="trending-up-outline" iconColor="#1E3A8A" label="Saldo" value={fmtCurrency(summary.saldoHoje)} />
                            </View>

                            {/* Próximo atendimento */}
                            <View className="bg-primary rounded-2xl p-5 mb-4">
                                <Text className="text-xs text-secondary font-medium mb-1">Próximo Atendimento</Text>
                                {summary.proximo ? (
                                    <>
                                        <Text className="text-white text-lg font-bold">{summary.proximo.a.time}</Text>
                                        <Text className="text-white text-sm mt-1" style={{ opacity: 0.9 }}>{summary.proximo.a.client}</Text>
                                        <Text className="text-white text-xs mt-0.5" style={{ opacity: 0.75 }}>{summary.proximo.a.service}</Text>
                                    </>
                                ) : (
                                    <Text className="text-white text-sm">Nenhum atendimento para hoje.</Text>
                                )}
                            </View>

                            {/* Agenda do dia */}
                            <SectionCard title="Agenda de hoje">
                                {summary.todayAppointments.length === 0 ? (
                                    <View className="items-center py-4">
                                        <Ionicons name="calendar-outline" size={32} color="#D1D5DB" />
                                        <Text className="text-gray-400 text-sm mt-2">Nenhum atendimento hoje</Text>
                                    </View>
                                ) : (
                                    summary.todayAppointments.map((a, i) => (
                                        <View
                                            key={a.id}
                                            className="flex-row items-center py-2.5"
                                            style={i < summary.todayAppointments.length - 1 ? { borderBottomWidth: 1, borderBottomColor: "#F3F4F6" } : undefined}
                                        >
                                            <View className="rounded-full mr-3" style={{ width: 8, height: 8, backgroundColor: STATUS_COLORS[a.status] }} />
                                            <Text className="text-sm font-semibold text-primary" style={{ width: 52 }}>{a.time}</Text>
                                            <Text className="text-sm text-inputText flex-1">{a.client}</Text>
                                        </View>
                                    ))
                                )}
                            </SectionCard>

                            {/* Resumo financeiro do mês */}
                            <SectionCard title="Resumo Financeiro do Mês">
                                <View className="flex-row justify-between items-center py-2" style={{ borderBottomWidth: 1, borderBottomColor: "#F3F4F6" }}>
                                    <Text className="text-sm text-gray-500">Receitas do mês</Text>
                                    <Text className="text-sm font-semibold" style={{ color: "#059669" }}>{fmtCurrency(summary.receitaMes)}</Text>
                                </View>
                                <View className="flex-row justify-between items-center py-2" style={{ borderBottomWidth: 1, borderBottomColor: "#F3F4F6" }}>
                                    <Text className="text-sm text-gray-500">Despesas</Text>
                                    <Text className="text-sm font-semibold" style={{ color: "#DC2626" }}>{fmtCurrency(summary.despesaMes)}</Text>
                                </View>
                                <View className="flex-row justify-between items-center py-2">
                                    <Text className="text-sm text-gray-500">Saldo</Text>
                                    <Text className="text-sm font-bold text-primary">{fmtCurrency(summary.saldoMes)}</Text>
                                </View>
                            </SectionCard>

                            {/* Desempenho */}
                            <SectionCard title="Desempenho">
                                <View className="flex-row mb-3" style={{ gap: 10 }}>
                                    <View className="flex-1 items-center">
                                        <Text className="text-xl font-bold" style={{ color: "#059669" }}>{summary.concluidosMes}</Text>
                                        <Text className="text-[11px] text-gray-500 mt-0.5">Serviços concluídos</Text>
                                    </View>
                                    <View className="flex-1 items-center">
                                        <Text className="text-xl font-bold" style={{ color: "#DC2626" }}>{summary.canceladosMes}</Text>
                                        <Text className="text-[11px] text-gray-500 mt-0.5">Cancelamentos</Text>
                                    </View>
                                </View>
                                <View className="flex-row" style={{ gap: 10 }}>
                                    <View className="flex-1 items-center">
                                        <Text className="text-xl font-bold text-primary">{fmtPercent(summary.taxaConclusao)}</Text>
                                        <Text className="text-[11px] text-gray-500 mt-0.5">Taxa de conclusão</Text>
                                    </View>
                                    <View className="flex-1 items-center">
                                        <Text className="text-xl font-bold text-primary">{fmtCurrency(summary.receitaMedia)}</Text>
                                        <Text className="text-[11px] text-gray-500 mt-0.5">Receita média</Text>
                                    </View>
                                </View>
                            </SectionCard>

                            {/* Atalhos rápidos */}
                            <View className="flex-row mb-3" style={{ gap: 10 }}>
                                <TouchableOpacity
                                    className="flex-1 bg-primary rounded-2xl p-4 items-center flex-row justify-center"
                                    style={{ gap: 6 }}
                                    onPress={() => router.push({ pathname: "/agenda", params: { new: "1" } })}
                                >
                                    <Ionicons name="add-circle-outline" size={18} color="#fff" />
                                    <Text className="text-white font-semibold" style={{ fontSize: 13 }}>Novo Agendamento</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="flex-1 border border-primary rounded-2xl p-4 items-center flex-row justify-center"
                                    style={{ gap: 6 }}
                                    onPress={() => router.push("/agenda")}
                                >
                                    <Ionicons name="calendar-outline" size={18} color="#1E3A8A" />
                                    <Text className="text-primary font-semibold" style={{ fontSize: 13 }}>Ver Agenda</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="flex-row mb-5" style={{ gap: 10 }}>
                                <TouchableOpacity
                                    className="flex-1 border border-dashed rounded-2xl p-4 items-center flex-row justify-center"
                                    style={{ gap: 6, borderColor: "#059669" }}
                                    onPress={() => router.push({ pathname: "/financial", params: { new: "receita" } })}
                                >
                                    <Ionicons name="add-circle-outline" size={18} color="#059669" />
                                    <Text className="font-semibold" style={{ fontSize: 13, color: "#059669" }}>Nova Receita</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="flex-1 border border-dashed rounded-2xl p-4 items-center flex-row justify-center"
                                    style={{ gap: 6, borderColor: "#DC2626" }}
                                    onPress={() => router.push({ pathname: "/financial", params: { new: "despesa" } })}
                                >
                                    <Ionicons name="add-circle-outline" size={18} color="#DC2626" />
                                    <Text className="font-semibold" style={{ fontSize: 13, color: "#DC2626" }}>Nova Despesa</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>

            <Modal
                isVisible={errorModalVisible}
                title="Erro"
                message="Não foi possível carregar o painel. Tente novamente."
                type="error"
                onClose={() => setErrorModalVisible(false)}
            />

            <NavbarGestao />
        </View>
    );
}
