import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { signOut } from "@/lib/api";
import { useSession } from "@/lib/providers";
import { Button, Card, Copy, Heading, Notice, Page } from "@/components/ui-kit";
export default function ProfileScreen() {
  const { user, online } = useSession();
  const logout = useMutation({
    mutationFn: signOut,
    onSuccess: () => router.replace("/"),
  });
  return (
    <Page title="Seu perfil">
      <Card>
        {user ? (
          <>
            <Heading>{user.name}</Heading>
            <Copy>{user.email}</Copy>
            <Copy>
              {user.role === "owner"
                ? "Conta de proprietário"
                : "Conta de cliente"}
            </Copy>
            <Button
              secondary
              title={logout.isPending ? "Saindo…" : "Sair da conta"}
              disabled={!online || logout.isPending}
              onPress={() => logout.mutate()}
            />
            <Notice error text={logout.error?.message} />
          </>
        ) : (
          <>
            <Heading>Seu espaço está esperando</Heading>
            <Copy>Entre ou crie sua conta para começar a reservar.</Copy>
            <Button
              title="Entrar ou cadastrar"
              onPress={() => router.push("/login")}
            />
          </>
        )}
      </Card>
    </Page>
  );
}
