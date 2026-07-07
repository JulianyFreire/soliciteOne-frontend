import { ScrollView, Text, View, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { NavbarGestao } from "../components/Navbar";
import { Header } from "../components/Header";
import { KPICard } from "../components/kpiCard";
import { BarChart } from "../components/barChart";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { router } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';

// --- Types ---
interface Solicitation {
  id: string;
  client: string;
  service: string;
  date: string;
  address: string;
  status: 'pendente' | 'aceita' | 'concluída' | 'cancelada';
  value: string;
}

interface Budget {
  id: string;
  client: string;
  service: string;
  value: string;
  date: string;
  status: 'rascunho' | 'enviado' | 'aceito' | 'rejeitado';
}

interface TodayAppointment {
  id: string;
  time: string;
  client: string;
  service: string;
  value: number;
  status: 'agendado' | 'confirmado' | 'concluído';
}

// --- Mock Data ---
const TODAY_APPOINTMENTS: TodayAppointment[] = [
  { id: '1', time: '08:00', client: 'Maria Silva',  service: 'Manicure',           value: 45,  status: 'confirmado' },
  { id: '2', time: '09:30', client: 'Ana Costa',    service: 'Pedicure',           value: 50,  status: 'agendado'  },
  { id: '3', time: '11:00', client: 'Carla Souza',  service: 'Design Sobrancelha', value: 30,  status: 'agendado'  },
  { id: '4', time: '14:00', client: 'Beatriz Lima', service: 'Hidratação Facial',  value: 90,  status: 'agendado'  },
];

const INIT_SOLICITATIONS: Solicitation[] = [
  { id: '1', client: 'Pedro Rocha',  service: 'Marcenaria',  date: '03/07', address: 'Tv. Central, 12 – Natal/RN', status: 'pendente', value: 'R$ 420,00' },
  { id: '2', client: 'João Santos',  service: 'Elétrica',    date: '04/07', address: 'Av. Brasil, 456 – Natal/RN', status: 'pendente', value: 'R$ 280,00' },
  { id: '3', client: 'Ana Lima',     service: 'Pintura',     date: '02/07', address: 'Rua do Sol, 789 – Natal/RN', status: 'concluída', value: 'R$ 500,00' },
];

const INIT_BUDGETS: Budget[] = [
  { id: '1', client: 'Carlos Mendes',  service: 'Reforma Banheiro', value: 'R$ 1.200,00', date: '29/06', status: 'enviado'  },
  { id: '2', client: 'Fernanda Costa', service: 'Pintura Quarto',   value: 'R$ 800,00',   date: '30/06', status: 'aceito'   },
  { id: '3', client: 'Roberto Alves',  service: 'Elétrica Geral',   value: 'R$ 650,00',   date: '01/07', status: 'rascunho' },
];

const WEEK_CASH_FLOW = [
  { day: 'Seg', revenue: 180, expense: 40 },
  { day: 'Ter', revenue: 220, expense: 60 },
  { day: 'Qua', revenue: 150, expense: 30 },
  { day: 'Qui', revenue: 300, expense: 80 },
  { day: 'Sex', revenue: 260, expense: 50 },
  { day: 'Sáb', revenue: 400, expense: 90 },
  { day: 'Dom', revenue: 90,  expense: 20 },
];

// --- Helpers ---
const fmtCurrency = (v: number) =>
  'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const SOLICITATION_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  pendente:  { label: 'Pendente',  color: '#D97706', bg: '#FEF3C7' },
  aceita:    { label: 'Aceita',    color: '#1E3A8A', bg: '#DBEAFE' },
  concluída: { label: 'Concluída', color: '#059669', bg: '#D1FAE5' },
  cancelada: { label: 'Cancelada', color: '#DC2626', bg: '#FEE2E2' },
};

const BUDGET_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  rascunho:  { label: 'Rascunho',  color: '#6B7280', bg: '#F3F4F6' },
  enviado:   { label: 'Enviado',   color: '#1E3A8A', bg: '#DBEAFE' },
  aceito:    { label: 'Aceito',    color: '#059669', bg: '#D1FAE5' },
  rejeitado: { label: 'Rejeitado', color: '#DC2626', bg: '#FEE2E2' },
};

const APP_STATUS_COLOR: Record<string, string> = {
  confirmado: '#059669',
  agendado:   '#1E3A8A',
  concluído:  '#6B7280',
};

function StatusBadge({ status, cfg }: { status: string; cfg: Record<string, { label: string; color: string; bg: string }> }) {
  const c = cfg[status] ?? { label: status, color: '#6B7280', bg: '#F3F4F6' };
  return (
    <View className="rounded-full px-2.5 py-0.5" style={{ backgroundColor: c.bg }}>
      <Text style={{ color: c.color, fontSize: 10, fontWeight: '700' }}>{c.label}</Text>
    </View>
  );
}

// --- Budget Modal ---
function BudgetModal({ visible, onClose, onSave }: { visible: boolean; onClose: () => void; onSave: (b: Budget) => void }) {
  const [form, setForm] = useState({ client: '', service: '', value: '' });
  const save = () => {
    if (!form.client || !form.service || !form.value) return;
    onSave({ id: String(Date.now()), client: form.client, service: form.service, value: `R$ ${form.value}`, date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), status: 'rascunho' });
    setForm({ client: '', service: '', value: '' });
    onClose();
  };
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <TouchableOpacity className="flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }} onPress={onClose} />
        <View className="bg-white rounded-t-3xl p-6" style={{ elevation: 12 }}>
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-lg font-semibold text-primary">Novo Orçamento</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color="#9CA3AF" /></TouchableOpacity>
          </View>
          <Text className="text-xs text-gray-500 mb-1.5 font-medium">Cliente</Text>
          <TextInput className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-800 mb-3 border border-gray-200" placeholder="Nome do cliente" value={form.client} onChangeText={t => setForm(f => ({ ...f, client: t }))} />
          <Text className="text-xs text-gray-500 mb-1.5 font-medium">Serviço</Text>
          <TextInput className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-800 mb-3 border border-gray-200" placeholder="Descrição do serviço" value={form.service} onChangeText={t => setForm(f => ({ ...f, service: t }))} />
          <Text className="text-xs text-gray-500 mb-1.5 font-medium">Valor estimado (R$)</Text>
          <TextInput className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-800 mb-5 border border-gray-200" placeholder="0,00" keyboardType="numeric" value={form.value} onChangeText={t => setForm(f => ({ ...f, value: t }))} />
          <TouchableOpacity className="bg-primary py-4 rounded-2xl items-center" onPress={save}>
            <Text className="text-white font-semibold text-base">Salvar Orçamento</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// --- Main ---
export default function Painel() {
  const { user } = useAuth();
  const [solicitations, setSolicitations] = useState<Solicitation[]>(INIT_SOLICITATIONS);
  const [budgets, setBudgets] = useState<Budget[]>(INIT_BUDGETS);
  const [todayApps] = useState<TodayAppointment[]>(TODAY_APPOINTMENTS);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  const firstName = user?.name?.split(' ')[0] ?? 'Profissional';
  const now = new Date();
  const todayLabel = now.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
  const todayFmt = todayLabel.charAt(0).toUpperCase() + todayLabel.slice(1);

  const pendingSols = solicitations.filter(s => s.status === 'pendente');
  const concludedSols = solicitations.filter(s => s.status === 'concluída');
  const weekRevenue = 1860;
  const todayTotal = todayApps.reduce((s, a) => s + a.value, 0);
  const occupancyRate = 70; // % da agenda ocupada esta semana
  const currentBalance = 2450;
  const forecast48h = 320;

  const weekCashFlowChart = WEEK_CASH_FLOW.map(d => ({
    label: d.day,
    value: d.revenue - d.expense,
    color: (d.revenue - d.expense) >= 0 ? '#10B981' : '#DC2626',
  }));

  const accept = (id: string) =>
    setSolicitations(prev => prev.map(s => s.id === id ? { ...s, status: 'aceita' } : s));
  const decline = (id: string) =>
    setSolicitations(prev => prev.map(s => s.id === id ? { ...s, status: 'cancelada' } : s));

  return (
    <View className="flex-1 bg-background">
      {/* ——— Header ——— */}
      <Header title={`Olá, ${firstName}`} subtitle={`${todayFmt}`} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* ——— KPIs ——— */}
        <View className="flex-row px-4 mt-6 mb-4" style={{ gap: 10 }}>
          <KPICard
            title="Faturamento"
            value={`${(weekRevenue / 1000).toFixed(1)}k`}
            subtitle="esta semana"
            icon="cash-outline"
            iconColor="#059669"
            iconBg="#D1FAE5"
          />
          <KPICard
            title="Agenda"
            value={`${occupancyRate}%`}
            subtitle="ocupada"
            icon="speedometer-outline"
            iconColor="#1E3A8A"
            iconBg="#DBEAFE"
          />
          <KPICard
            title="Serviços"
            value={String(concludedSols.length)}
            subtitle={`${pendingSols.length} pendente${pendingSols.length !== 1 ? 's' : ''}`}
            icon="checkmark-done-outline"
            iconColor="#7C3AED"
            iconBg="#EDE9FE"
          />
        </View>

        {/* ——— Hoje na Agenda ——— */}
        <View className="mx-4 mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <View>
              <Text className="text-base font-semibold text-primary">Minha Agenda de Hoje</Text>
              <Text className="text-xs text-gray-400 mt-0.5">{fmtCurrency(todayTotal)} em atendimentos</Text>
            </View>
            <TouchableOpacity
              className="flex-row items-center rounded-xl px-3 py-1.5 bg-primary"
              style={{ gap: 4 }}
              onPress={() => router.push('/agenda')}
            >
              <Ionicons name="calendar-outline" size={13} color="white" />
              <Text className="text-white text-xs font-semibold">Ver agenda</Text>
            </TouchableOpacity>
          </View>

          {todayApps.length === 0 ? (
            <View className="bg-white rounded-2xl p-8 items-center" style={{ elevation: 1 }}>
              <Ionicons name="calendar-outline" size={40} color="#D1D5DB" />
              <Text className="text-gray-400 text-sm mt-2">Nenhum atendimento hoje</Text>
              <TouchableOpacity
                className="mt-3 flex-row items-center"
                style={{ gap: 4 }}
                onPress={() => router.push('/agenda')}
              >
                <Ionicons name="add-circle-outline" size={14} color="#1E3A8A" />
                <Text className="text-primary text-xs font-semibold">Adicionar atendimento</Text>
              </TouchableOpacity>
            </View>
          ) : (
            todayApps.map((app, i) => (
              <TouchableOpacity
                key={app.id}
                className="flex-row mb-2"
                style={{ gap: 10 }}
                onPress={() => router.push('/agenda')}
              >
                {/* Time + line */}
                <View className="items-center" style={{ width: 46 }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#1E3A8A' }}>{app.time}</Text>
                  {i < todayApps.length - 1 && (
                    <View style={{ flex: 1, width: 1.5, backgroundColor: '#E5E7EB', marginTop: 4, minHeight: 20 }} />
                  )}
                </View>
                {/* Card */}
                <View
                  className="flex-1 bg-white rounded-xl p-3"
                  style={{ elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, borderLeftWidth: 3, borderLeftColor: APP_STATUS_COLOR[app.status] }}
                >
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm font-semibold text-gray-800 flex-1 mr-2">{app.client}</Text>
                    {app.status === 'confirmado' && (
                      <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: '#D1FAE5' }}>
                        <Text style={{ fontSize: 9, fontWeight: '700', color: '#059669' }}>Confirmado</Text>
                      </View>
                    )}
                  </View>
                  <View className="flex-row justify-between mt-1">
                    <Text className="text-xs text-gray-500">{app.service}</Text>
                    <Text className="text-xs font-semibold text-primary">{fmtCurrency(app.value)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
        
        {/* ——— Fluxo de Caixa ——— */}
        <View className="mx-4 mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-base font-semibold text-primary">Meu Fluxo de Caixa</Text>
            <TouchableOpacity onPress={() => router.push('/financeiro')}>
              <Text className="text-primary text-xs font-semibold">Ver financeiro completo</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row mb-3" style={{ gap: 10 }}>
            <View className="flex-1 bg-white rounded-2xl p-4" style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6 }}>
              <Text className="text-xs text-gray-500">Saldo disponível</Text>
              <Text className="text-lg font-semibold text-primary mt-1">{fmtCurrency(currentBalance)}</Text>
            </View>
            <View className="flex-1 bg-white rounded-2xl p-4" style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6 }}>
              <Text className="text-xs text-gray-500">Previsão em 48h</Text>
              <Text className="text-lg font-semibold" style={{ color: '#059669' }}>{fmtCurrency(forecast48h)}</Text>
            </View>
          </View>

          <BarChart
            data={weekCashFlowChart}
            title="Receita líquida por dia (semana)"
            formatValue={(v) => `${v}`}
            height={110}
            legend={[
              { label: 'Saldo positivo', color: '#10B981' },
              { label: 'Saldo negativo', color: '#DC2626' },
            ]}
          />
        </View>
      </ScrollView>

      <BudgetModal
        visible={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        onSave={b => setBudgets(prev => [b, ...prev])}
      />

      <NavbarGestao />
    </View>
  );
}
