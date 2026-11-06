import { Children, type ReactNode } from "react";
import { useWindowDimensions, View } from "react-native";
export function ResponsiveGrid({ children }: { children: ReactNode }) {
  const { width } = useWindowDimensions();
  const columns = width >= 1100 ? 3 : width >= 600 ? 2 : 1;
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", margin: -8 }}>
      {Children.toArray(children).map((child, index) => (
        <View
          key={index}
          style={{ width: `${100 / columns}%`, padding: 8, minWidth: 0 }}
        >
          {child}
        </View>
      ))}
    </View>
  );
}
