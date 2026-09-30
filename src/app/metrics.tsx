import { useEffect, useMemo, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NavbarGestao } from "../components/Navbar";
import Modal from "../components/Modal";
import api from "../services/api";
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
    id: string;
    date: Date;
    description: string;
    value: number;
    type: TransactionType;
}

const WEEKDAYS_FULL = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const MONTH_ABBR = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

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
    id: a._id,
    date: new Date(a.date),
    description: a.description,
    value: a.value,
    type: a.type,
});

const toDateTime = (a: AppointmentEntry) => {
    const [hh, mm] = a.time.split(':').map(Number);
    return new Date(a.date.getUTCFullYear(), a.date.getUTCMonth(), a.date.getUTCDate(), hh || 0, mm || 0);
};

interface Bar {
    label: string;
    value: number;
    current?: boolean;
}

function BarChart({
    bars,
    color,
    mutedColor,
    formatValue,
    height = 110,
    labelEvery = 1,
}: {
    bars: Bar[];
    color: string;
    mutedColor: string;
    formatValue?: (v: number) => string;
    height?: number;
    labelEvery?: number;
}) {
    const max = Math.max(...bars.map(b => b.value), 0) || 1;

    return (
        <View>
            <View
                className="flex-row items-end justify-between"
                style={{ height, borderBottomWidth: 1, borderBottomColor: "#E5E7EB" }}
            >
                {bars.map((b, i) => {
                    const barHeight = b.value > 0 ? Math.max((b.value / max) * height, 4) : 0;
                    return (
                        <View key={i} className="flex-1 items-center justify-end" style={{ height }}>
                            {formatValue && b.value > 0 && (
                                <Text style={{ fontSize: 9, fontWeight: "700", color, marginBottom: 3 }}>
                                    {formatValue(b.value)}
                                </Text>
                            )}
                            <View
                                style={{
                                    width: Math.max(4, Math.min(20, 220 / bars.length - 3)),
                                    height: barHeight,
                                    backgroundColor: b.current ? color : mutedColor,
                                    borderTopLeftRadius: 3,
                                    borderTopRightRadius: 3,
                                }}
                            />
                        </View>
                    );
                })}
            </View>
            <View className="flex-row justify-between mt-1.5">
                {bars.map((b, i) => (
                    <View key={i} className="flex-1 items-center">
                        <Text style={{ fontSize: 9, color: "#9CA3AF" }}>
                            {i % labelEvery === 0 || b.current ? b.label : ""}
                        </Text>
                    </View>
                ))}
            </View>
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

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
    return (
        <View
            className="flex-row justify-between items-center py-2"
            style={!last ? { borderBottomWidth: 1, borderBottomColor: "#F3F4F6" } : undefined}
        >
            <Text className="text-sm text-gray-500 flex-1 mr-2">{label}</Text>
            <Text className="text-sm font-semibold text-inputText" style={{ textAlign: "right" }}>{value}</Text>
        </View>
    );
}

// Mostra a variação em relação ao mês anterior. `invert` inverte o sentido
// bom/ruim da cor (ex: despesa e cancelados subindo é ruim, não bom).
function Delta({ current, previous, invert }: { current: number; previous: number; invert?: boolean }) {
    if (!previous) return null;
    const change = (current - previous) / previous;
    if (Math.round(change * 100) === 0) {
        return <Text style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>= vs mês passado</Text>;
    }
    const isUp = change > 0;
    const isGood = invert ? !isUp : isUp;
    const color = isGood ? "#059669" : "#DC2626";
    return (
        <View className="flex-row items-center" style={{ gap: 2, marginTop: 2 }}>
            <Ionicons name={isUp ? "arrow-up" : "arrow-down"} size={10} color={color} />
            <Text style={{ fontSize: 10, fontWeight: "700", color }}>
                {Math.abs(Math.round(change * 100))}% vs mês passado
            </Text>
        </View>
    );
}

export default function Metricas() {
    const [appointments, setAppointments] = useState<AppointmentEntry[]>([]);
    const [transactions, setTransactions] = useState<TransactionEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorModalVisible, setErrorModalVisible] = useState(false);

    useEffect(() => {
        setLoading(true);
        Promise.all([api.get('/appointments'), api.get('/transactions')])
            .then(([appointmentsRes, transactionsRes]) => {
                setAppointments(appointmentsRes.data.map(mapAppointment));
                setTransactions(transactionsRes.data.map(mapTransaction));
            })
            .catch(() => setErrorModalVisible(true))
            .finally(() => setLoading(false));
    }, []);

    const metrics = useMemo(() => {
        const now = new Date();
        const y = now.getFullYear();
        const m = now.getMonth();
        const d = now.getDate();

        const dateKey = (dt: Date) => `${dt.getUTCFullYear()}-${dt.getUTCMonth()}-${dt.getUTCDate()}`;
        const todayKey = `${y}-${m}-${d}`;

        const mondayOffset = (now.getDay() + 6) % 7;
        const weekKeys = new Set(
            Array.from({ length: 7 }, (_, i) => {
                const dt = new Date(y, m, d - mondayOffset + i);
                return `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;
            }),
        );

        const isThisMonth = (dt: Date) => dt.getUTCFullYear() === y && dt.getUTCMonth() === m;

        const todayAppointments = appointments.filter(a => dateKey(a.date) === todayKey);
        const weekAppointments = appointments.filter(a => weekKeys.has(dateKey(a.date)));
        const monthAppointments = appointments.filter(a => isThisMonth(a.date));

        const concluidosMes = monthAppointments.filter(a => a.status === "concluído").length;
        const canceladosMes = monthAppointments.filter(a => a.status === "cancelado").length;
        const reagendadosMes = monthAppointments.filter(a => a.status === "reagendado").length;
        const totalAgendadosMes = monthAppointments.length;

        const taxaConclusao = totalAgendadosMes ? concluidosMes / totalAgendadosMes : 0;
        const taxaCancelamento = totalAgendadosMes ? canceladosMes / totalAgendadosMes : 0;

        const workedDaysSet = new Set(monthAppointments.map(a => a.date.getUTCDate()));
        const mediaAtendimentosPorDia = workedDaysSet.size ? totalAgendadosMes / workedDaysSet.size : 0;

        const proximo = appointments
            .filter(a => a.status !== "cancelado")
            .map(a => ({ a, dt: toDateTime(a) }))
            .filter(x => x.dt.getTime() >= now.getTime())
            .sort((x, y2) => x.dt.getTime() - y2.dt.getTime())[0];

        let proximoLabel = "";
        if (proximo) {
            const dtKey = `${proximo.dt.getFullYear()}-${proximo.dt.getMonth()}-${proximo.dt.getDate()}`;
            const tomorrow = new Date(y, m, d + 1);
            const tomorrowKey = `${tomorrow.getFullYear()}-${tomorrow.getMonth()}-${tomorrow.getDate()}`;
            if (dtKey === todayKey) proximoLabel = "Hoje";
            else if (dtKey === tomorrowKey) proximoLabel = "Amanhã";
            else proximoLabel = `${WEEKDAYS_FULL[proximo.dt.getDay()]}, ${proximo.dt.getDate()} de ${MONTH_ABBR[proximo.dt.getMonth()]}`;
        }

        const receitaTotal = appointments.filter(a => a.paid).reduce((s, a) => s + a.value, 0)
            + transactions.filter(t => t.type === "receita").reduce((s, t) => s + t.value, 0);
        const despesasTotais = transactions.filter(t => t.type === "despesa").reduce((s, t) => s + t.value, 0);
        const saldoAtual = receitaTotal - despesasTotais;
        const lucroLiquido = saldoAtual;

        const receitaMes = monthAppointments.filter(a => a.paid).reduce((s, a) => s + a.value, 0)
            + transactions.filter(t => t.type === "receita" && isThisMonth(t.date)).reduce((s, t) => s + t.value, 0);
        const despesaMes = transactions.filter(t => t.type === "despesa" && isThisMonth(t.date)).reduce((s, t) => s + t.value, 0);

        const mediaReceitaPorAtendimento = concluidosMes ? receitaMes / concluidosMes : 0;

        const weekdayCounts = [0, 0, 0, 0, 0, 0, 0];
        monthAppointments.forEach(a => { weekdayCounts[a.date.getUTCDay()]++; });
        const diasMaisMovimentados = WEEKDAYS_FULL
            .map((label, i) => ({ label, count: weekdayCounts[i] }))
            .filter(w => w.count > 0)
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

        // Mês anterior, pra saber se tá subindo ou caindo.
        const prevMonthDate = new Date(y, m - 1, 1);
        const py = prevMonthDate.getFullYear();
        const pm = prevMonthDate.getMonth();
        const isPrevMonth = (dt: Date) => dt.getUTCFullYear() === py && dt.getUTCMonth() === pm;
        const prevMonthAppointments = appointments.filter(a => isPrevMonth(a.date));
        const concluidosMesAnterior = prevMonthAppointments.filter(a => a.status === "concluído").length;
        const canceladosMesAnterior = prevMonthAppointments.filter(a => a.status === "cancelado").length;
        const receitaMesAnterior = prevMonthAppointments.filter(a => a.paid).reduce((s, a) => s + a.value, 0)
            + transactions.filter(t => t.type === "receita" && isPrevMonth(t.date)).reduce((s, t) => s + t.value, 0);
        const despesaMesAnterior = transactions.filter(t => t.type === "despesa" && isPrevMonth(t.date)).reduce((s, t) => s + t.value, 0);

        // Últimos 6 meses: faturamento, despesas e volume de agendamentos separados
        // (antes era um único gráfico com receita−despesa, o que escondia a resposta
        // de "quanto ganhei" e "quanto gastei" atrás de um número só).
        const monthlyRevenueChart: Bar[] = [];
        const monthlyExpenseChart: Bar[] = [];
        const monthlyAppointmentsChart: Bar[] = [];
        for (let i = 5; i >= 0; i--) {
            const bucketDate = new Date(y, m - i, 1);
            const by = bucketDate.getFullYear();
            const bm = bucketDate.getMonth();
            const isCurrent = by === y && bm === m;
            const bucketAppointments = appointments.filter(a => a.date.getUTCFullYear() === by && a.date.getUTCMonth() === bm);
            const receita = bucketAppointments.filter(a => a.paid).reduce((s, a) => s + a.value, 0)
                + transactions
                    .filter(t => t.type === "receita" && t.date.getUTCFullYear() === by && t.date.getUTCMonth() === bm)
                    .reduce((s, t) => s + t.value, 0);
            const despesa = transactions
                .filter(t => t.type === "despesa" && t.date.getUTCFullYear() === by && t.date.getUTCMonth() === bm)
                .reduce((s, t) => s + t.value, 0);
            monthlyRevenueChart.push({ label: MONTH_ABBR[bm], value: receita, current: isCurrent });
            monthlyExpenseChart.push({ label: MONTH_ABBR[bm], value: despesa, current: isCurrent });
            monthlyAppointmentsChart.push({ label: MONTH_ABBR[bm], value: bucketAppointments.length, current: isCurrent });
        }

        const daysInMonth = new Date(y, m + 1, 0).getDate();
        const dailyChart: Bar[] = Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const count = monthAppointments.filter(a => a.date.getUTCDate() === day).length;
            return { label: String(day), value: count, current: day === d };
        });

        const ultimaMovimentacao = [...transactions].sort((a, b) => b.date.getTime() - a.date.getTime())[0];
        const ultimoServico = [...appointments]
            .filter(a => a.status === "concluído")
            .sort((a, b) => toDateTime(b).getTime() - toDateTime(a).getTime())[0];
        const ultimaReceita = [...transactions]
            .filter(t => t.type === "receita")
            .sort((a, b) => b.date.getTime() - a.date.getTime())[0];

        return {
            todayCount: todayAppointments.length,
            weekCount: weekAppointments.length,
            monthCount: totalAgendadosMes,
            concluidosMes,
            canceladosMes,
            reagendadosMes,
            concluidosMesAnterior,
            canceladosMesAnterior,
            proximo,
            proximoLabel,
            receitaTotal,
            despesasTotais,
            saldoAtual,
            lucroLiquido,
            receitaMes,
            despesaMes,
            receitaMesAnterior,
            despesaMesAnterior,
            taxaConclusao,
            taxaCancelamento,
            mediaAtendimentosPorDia,
            mediaReceitaPorAtendimento,
            diasMaisMovimentados,
            monthlyRevenueChart,
            monthlyExpenseChart,
            monthlyAppointmentsChart,
            dailyChart,
            ultimaMovimentacao,
            ultimoServico,
            ultimaReceita,
        };
    }, [appointments, transactions]);

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
                            {/* KPIs */}
                            <View className="flex-row mb-3" style={{ gap: 10 }}>
                                <View className="flex-1 bg-surface rounded-2xl p-3" style={CARD_SHADOW}>
                                    <View className="flex-row items-center mb-1.5" style={{ gap: 4 }}>
                                        <Ionicons name="calendar-outline" size={13} color="#1E3A8A" />
                                        <Text className="text-[10px] text-gray-500 font-medium">Hoje</Text>
                                    </View>
                                    <Text className="text-base font-bold text-primary">{metrics.todayCount}</Text>
                                </View>
                                <View className="flex-1 bg-surface rounded-2xl p-3" style={CARD_SHADOW}>
                                    <View className="flex-row items-center mb-1.5" style={{ gap: 4 }}>
                                        <Ionicons name="cash-outline" size={13} color="#059669" />
                                        <Text className="text-[10px] text-gray-500 font-medium">Receita do Mês</Text>
                                    </View>
                                    <Text className="text-base font-bold" style={{ color: "#059669" }}>{fmtCurrency(metrics.receitaMes)}</Text>
                                    <Delta current={metrics.receitaMes} previous={metrics.receitaMesAnterior} />
                                </View>
                                <View className="flex-1 bg-surface rounded-2xl p-3" style={CARD_SHADOW}>
                                    <View className="flex-row items-center mb-1.5" style={{ gap: 4 }}>
                                        <Ionicons name="arrow-down-circle-outline" size={13} color="#DC2626" />
                                        <Text className="text-[10px] text-gray-500 font-medium">Despesa do Mês</Text>
                                    </View>
                                    <Text className="text-base font-bold" style={{ color: "#DC2626" }}>{fmtCurrency(metrics.despesaMes)}</Text>
                                    <Delta current={metrics.despesaMes} previous={metrics.despesaMesAnterior} invert />
                                </View>
                            </View>

                            <View className="flex-row mb-5" style={{ gap: 10 }}>
                                <View className="flex-1 bg-surface rounded-2xl p-3" style={CARD_SHADOW}>
                                    <View className="flex-row items-center mb-1.5" style={{ gap: 4 }}>
                                        <Ionicons name="wallet-outline" size={13} color="#1E3A8A" />
                                        <Text className="text-[10px] text-gray-500 font-medium">Saldo Atual</Text>
                                    </View>
                                    <Text className="text-base font-bold text-primary">{fmtCurrency(metrics.saldoAtual)}</Text>
                                </View>
                                <View className="flex-1 bg-surface rounded-2xl p-3" style={CARD_SHADOW}>
                                    <View className="flex-row items-center mb-1.5" style={{ gap: 4 }}>
                                        <Ionicons name="checkmark-circle-outline" size={13} color="#059669" />
                                        <Text className="text-[10px] text-gray-500 font-medium">Concluídos</Text>
                                    </View>
                                    <Text className="text-base font-bold" style={{ color: "#059669" }}>{metrics.concluidosMes}</Text>
                                    <Delta current={metrics.concluidosMes} previous={metrics.concluidosMesAnterior} />
                                </View>
                                <View className="flex-1 bg-surface rounded-2xl p-3" style={CARD_SHADOW}>
                                    <View className="flex-row items-center mb-1.5" style={{ gap: 4 }}>
                                        <Ionicons name="close-circle-outline" size={13} color="#DC2626" />
                                        <Text className="text-[10px] text-gray-500 font-medium">Cancelados</Text>
                                    </View>
                                    <Text className="text-base font-bold" style={{ color: "#DC2626" }}>{metrics.canceladosMes}</Text>
                                    <Delta current={metrics.canceladosMes} previous={metrics.canceladosMesAnterior} invert />
                                </View>
                            </View>

                            {/* Faturamento — responde "como está meu faturamento?" e a tendência de crescimento */}
                            <SectionCard title="Faturamento (últimos 6 meses)">
                                <BarChart
                                    bars={metrics.monthlyRevenueChart}
                                    color="#059669"
                                    mutedColor="#A7D9C7"
                                    formatValue={(v) => "R$ " + Math.round(v).toLocaleString("pt-BR")}
                                />
                            </SectionCard>

                            {/* Despesas — responde "quanto estou gastando?" */}
                            <SectionCard title="Despesas (últimos 6 meses)">
                                <BarChart
                                    bars={metrics.monthlyExpenseChart}
                                    color="#DC2626"
                                    mutedColor="#F5B5B5"
                                    formatValue={(v) => "R$ " + Math.round(v).toLocaleString("pt-BR")}
                                />
                            </SectionCard>

                            {/* Agendamentos por mês — responde "estou aumentando ou reduzindo meus atendimentos?" */}
                            <SectionCard title="Agendamentos (últimos 6 meses)">
                                <BarChart
                                    bars={metrics.monthlyAppointmentsChart}
                                    color="#7C3AED"
                                    mutedColor="#DDD6FE"
                                />
                            </SectionCard>

                            {/* Gráfico de Agendamentos por dia */}
                            <SectionCard title="Agendamentos por dia (mês atual)">
                                <BarChart
                                    bars={metrics.dailyChart}
                                    color="#7C3AED"
                                    mutedColor="#DDD6FE"
                                    labelEvery={5}
                                    height={90}
                                />
                            </SectionCard>

                            {/* Taxas */}
                            <View className="flex-row mb-5" style={{ gap: 10 }}>
                                <View className="flex-1 bg-surface rounded-2xl p-3.5 items-center" style={CARD_SHADOW}>
                                    <Text className="text-[11px] text-gray-500 font-medium mb-1">Taxa de Conclusão</Text>
                                    <Text className="text-2xl font-bold" style={{ color: "#059669" }}>{fmtPercent(metrics.taxaConclusao)}</Text>
                                </View>
                                <View className="flex-1 bg-surface rounded-2xl p-3.5 items-center" style={CARD_SHADOW}>
                                    <Text className="text-[11px] text-gray-500 font-medium mb-1">Taxa de Cancelamento</Text>
                                    <Text className="text-2xl font-bold" style={{ color: "#DC2626" }}>{fmtPercent(metrics.taxaCancelamento)}</Text>
                                </View>
                            </View>

                            {/* Próximo atendimento */}
                            <View className="bg-primary rounded-2xl p-5 mb-4">
                                <Text className="text-xs text-secondary font-medium mb-1">Próximo Atendimento</Text>
                                {metrics.proximo ? (
                                    <>
                                        <Text className="text-white text-lg font-bold">
                                            {metrics.proximoLabel} • {metrics.proximo.a.time}
                                        </Text>
                                        <Text className="text-white text-sm mt-1" style={{ opacity: 0.85 }}>
                                            {metrics.proximo.a.client}
                                        </Text>
                                    </>
                                ) : (
                                    <Text className="text-white text-sm">Nenhum atendimento futuro agendado</Text>
                                )}
                            </View>

                            {/* Mais indicadores */}
                            <SectionCard title="Mais indicadores">
                                <InfoRow label="Agendamentos da semana" value={String(metrics.weekCount)} />
                                <InfoRow label="Agendamentos do mês" value={String(metrics.monthCount)} />
                                <InfoRow label="Reagendados (mês)" value={String(metrics.reagendadosMes)} />
                                <InfoRow label="Receita total" value={fmtCurrency(metrics.receitaTotal)} />
                                <InfoRow label="Despesas totais" value={fmtCurrency(metrics.despesasTotais)} />
                                <InfoRow label="Lucro líquido" value={fmtCurrency(metrics.lucroLiquido)} />
                                <InfoRow label="Média de atendimentos/dia" value={metrics.mediaAtendimentosPorDia.toFixed(1)} />
                                <InfoRow label="Média de receita/atendimento" value={fmtCurrency(metrics.mediaReceitaPorAtendimento)} />
                                <View className="flex-row justify-between items-center py-2">
                                    <Text className="text-sm text-gray-500 flex-1 mr-2">Dias mais movimentados</Text>
                                    <View className="flex-row" style={{ gap: 6 }}>
                                        {metrics.diasMaisMovimentados.length === 0 ? (
                                            <Text className="text-sm font-semibold text-inputText">—</Text>
                                        ) : (
                                            metrics.diasMaisMovimentados.map(w => (
                                                <View key={w.label} className="rounded-full px-2 py-0.5" style={{ backgroundColor: "#DBEAFE" }}>
                                                    <Text style={{ fontSize: 10, fontWeight: "700", color: "#1E3A8A" }}>
                                                        {w.label.slice(0, 3)} ({w.count})
                                                    </Text>
                                                </View>
                                            ))
                                        )}
                                    </View>
                                </View>
                            </SectionCard>

                            {/* Resumo operacional */}
                            <SectionCard title="Resumo Operacional">
                                <InfoRow
                                    label="Última movimentação financeira"
                                    value={
                                        metrics.ultimaMovimentacao
                                            ? `${metrics.ultimaMovimentacao.type === "receita" ? "+" : "−"} ${fmtCurrency(metrics.ultimaMovimentacao.value)}`
                                            : "—"
                                    }
                                />
                                <InfoRow
                                    label="Último serviço realizado"
                                    value={metrics.ultimoServico ? metrics.ultimoServico.service : "—"}
                                />
                                <InfoRow
                                    label="Última receita cadastrada"
                                    value={metrics.ultimaReceita ? fmtCurrency(metrics.ultimaReceita.value) : "—"}
                                    last
                                />
                            </SectionCard>
                        </>
                    )}
                </View>
            </ScrollView>

            <Modal
                isVisible={errorModalVisible}
                title="Erro"
                message="Não foi possível carregar as métricas. Tente novamente."
                type="error"
                onClose={() => setErrorModalVisible(false)}
            />

            <NavbarGestao />
        </View>
    );
}
