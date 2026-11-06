import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Icon } from "./ui-kit";
import { useTheme } from "@/theme/context";
import { fonts } from "@/theme/tokens";
import type { Category } from "@/lib/types";
const artwork = {
  sports_court: {
    light: ["#DAD7FF", "#EDE7FF"],
    dark: ["#38305D", "#4B3A6A"],
    title: "BORA JOGAR?",
    caption: "Uma pausa para se movimentar",
    icon: "activity",
  },
  party_hall: {
    light: ["#FFE0D8", "#FBE2EF"],
    dark: ["#5A3046", "#643F42"],
    title: "VAMOS CELEBRAR",
    caption: "Encontros que viram histórias",
    icon: "gift",
  },
  office: {
    light: ["#DCEEEB", "#E5E9FB"],
    dark: ["#234B4A", "#343A5A"],
    title: "TEMPO DE CUIDAR",
    caption: "Espaço para o seu atendimento",
    icon: "plus-square",
  },
} as const;
export function SpaceCover({
  category,
  imageUrl,
  height = 190,
  name,
}: {
  category: Category;
  imageUrl?: string | null;
  height?: number;
  name: string;
}) {
  const { isDark, reducedMotion } = useTheme();
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const art = artwork[category];
  const large = height > 220;
  if (imageUrl && imageUrl !== failedUrl)
    return (
      <Image
        source={{ uri: imageUrl }}
        accessibilityLabel={`Foto de ${name}`}
        style={{ height, width: "100%", borderRadius: 20 }}
        contentFit="cover"
        transition={reducedMotion ? 0 : 180}
        onError={() => setFailedUrl(imageUrl)}
      />
    );
  const ink = isDark ? "#F3EFFA" : "#38294E";
  const line = isDark ? "#B9AAF8" : "#6D55A6";
  return (
    <LinearGradient
      accessible
      accessibilityLabel={`Ilustração de ${category === "sports_court" ? "quadra" : category === "party_hall" ? "salão de festas" : "consultório"}`}
      colors={isDark ? art.dark : art.light}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={{
        height,
        borderRadius: 20,
        overflow: "hidden",
        padding: large ? 28 : 20,
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          position: "absolute",
          right: -30,
          top: -60,
          width: 210,
          height: 210,
          borderRadius: 110,
          borderWidth: 1,
          borderColor: `${line}30`,
        }}
      />
      <View
        style={{
          position: "absolute",
          right: 5,
          top: -25,
          width: 170,
          height: 170,
          borderRadius: 90,
          borderWidth: 1,
          borderColor: `${line}30`,
        }}
      />
      <Text
        style={{
          color: ink,
          fontFamily: fonts.bold,
          fontSize: 9,
          letterSpacing: 1.7,
        }}
      >
        {art.title}
      </Text>
      {category === "sports_court" ? (
        <View
          style={{
            position: "absolute",
            right: large ? 55 : 22,
            top: large ? 55 : 40,
            width: large ? 245 : 155,
            height: large ? 155 : 105,
            borderWidth: 2,
            borderColor: line,
            borderRadius: 8,
            transform: [{ rotate: "-14deg" }],
            opacity: 0.8,
          }}
        >
          <View
            style={{
              position: "absolute",
              left: "50%",
              height: "100%",
              borderLeftWidth: 2,
              borderColor: line,
            }}
          />
          <View
            style={{
              width: large ? 64 : 42,
              height: large ? 64 : 42,
              borderWidth: 2,
              borderColor: line,
              borderRadius: 40,
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: [
                { translateX: large ? -32 : -21 },
                { translateY: large ? -32 : -21 },
              ],
            }}
          />
          <View
            style={{
              position: "absolute",
              left: -2,
              top: "25%",
              height: "50%",
              width: "24%",
              borderWidth: 2,
              borderColor: line,
            }}
          />
          <View
            style={{
              position: "absolute",
              right: -2,
              top: "25%",
              height: "50%",
              width: "24%",
              borderWidth: 2,
              borderColor: line,
            }}
          />
          <View
            style={{
              position: "absolute",
              right: 26,
              bottom: 16,
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: "#FF806C",
              borderWidth: 3,
              borderColor: "#FFE8DF",
            }}
          />
        </View>
      ) : (
        <View
          style={{
            position: "absolute",
            right: large ? 65 : 30,
            top: large ? 45 : 28,
            width: large ? 190 : 120,
            height: large ? 190 : 120,
            alignItems: "center",
            justifyContent: "center",
            transform: [
              { rotate: category === "party_hall" ? "12deg" : "-10deg" },
            ],
          }}
        >
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: `${line}18`,
                borderRadius: category === "party_hall" ? 80 : 30,
                borderWidth: 1,
                borderColor: `${line}30`,
              },
            ]}
          />
          <Icon name={art.icon} size={large ? 80 : 54} color={line} />
          <View
            style={{
              position: "absolute",
              top: -4,
              left: 0,
              width: 19,
              height: 19,
              backgroundColor: "#FF806C",
              borderRadius: 6,
              transform: [{ rotate: "25deg" }],
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: 0,
              right: -5,
              width: 22,
              height: 22,
              borderRadius: 11,
              borderWidth: 4,
              borderColor: line,
            }}
          />
        </View>
      )}
      <View style={{ maxWidth: large ? 230 : 145 }}>
        <Text
          style={{
            color: ink,
            fontFamily: fonts.semibold,
            fontSize: large ? 22 : 15,
            lineHeight: large ? 30 : 21,
          }}
        >
          {art.caption}
        </Text>
      </View>
    </LinearGradient>
  );
}
