import { View, Text } from "react-native";
import { Link, usePathname } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const TABS = [
  { href: "/" as const, label: "Painel", icon: "grid-outline" as const },
  { href: "/profile" as const, label: "Perfil", icon: "person-outline" as const },
];

export function NavbarGestao() {
  const pathname = usePathname();

  return (
    <View className="flex-row bottom-0 left-0 right-0 h-16 justify-around items-center bg-white border-t border-secondary py-2">
      {TABS.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link key={tab.href} href={tab.href}>
            <View className="flex-col items-center" style={{ width: 64 }}>
              <Ionicons name={tab.icon} size={22} color={isActive ? "#1E3A8A" : "#9CA3AF"} />
              <Text style={{ fontSize: 11, marginTop: 2, color: isActive ? "#1E3A8A" : "#9CA3AF", fontWeight: isActive ? "700" : "400" }}>
                {tab.label}
              </Text>
            </View>
          </Link>
        );
      })}
    </View>
  );
}
