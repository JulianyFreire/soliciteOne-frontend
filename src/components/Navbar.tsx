import { View, Text } from "react-native";
import { Link, usePathname } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const TABS = [
  { href: "/" as const, label: "Painel", icon: "grid-outline" as const },
  { href: "/agenda" as const, label: "Agenda", icon: "calendar-outline" as const },
  { href: "/financial" as const, label: "Financeiro", icon: "wallet-outline" as const },
  { href: "/metrics" as const, label: "Métricas", icon: "bar-chart-outline" as const },
  { href: "/profile" as const, label: "Perfil", icon: "person-outline" as const },
];

export function NavbarGestao() {
  const pathname = usePathname();

  return (
    <View className="absolute bottom-0 left-0 right-0 flex-row h-16 justify-around items-center bg-white py-2">
      {TABS.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link key={tab.href} href={tab.href}>
            <View className="w-16 items-center">
              <Ionicons name={tab.icon} size={22} color={isActive ? "#1E3A8A" : "#9CA3AF"} />
              <Text className={`mt-0.5 text-[11px] font-regular ${isActive ? "text-primary" : "text-gray-400"}`}>
                {tab.label}
              </Text>
            </View>
          </Link>
        );
      })}
    </View>
  );
}
