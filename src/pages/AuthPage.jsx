import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { signIn, signUp, onAuthStateChangedListener, signInWithGoogle } from "@/firebase";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { FcGoogle } from 'react-icons/fc';

const AuthPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const db = getFirestore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Detecta usuário autenticado
  React.useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((u) => setUser(u));
    return () => unsubscribe && unsubscribe();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fn = isLogin ? signIn : signUp;
    const result = await fn(email, password);
    setLoading(false);
    if (result.error) {
      toast({ title: "Erro", description: result.error, variant: "destructive" });
    } else {
      if (!isLogin && result.user) {
        // Cadastro: cria documento da empresa no Firestore
        const empresaRef = doc(db, "empresas", result.user.uid);
        await setDoc(empresaRef, {
          email: result.user.email,
          createdAt: new Date(),
          nomeEmpresa: "",
          // Adicione outros campos iniciais aqui
        });
      }
      toast({ title: "Sucesso", description: isLogin ? "Login realizado!" : "Cadastro realizado!" });
      navigate("/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const result = await signInWithGoogle();
    setLoading(false);
    if (result.user) {
      toast({ title: 'Sucesso', description: 'Login com Google realizado!' });
      navigate('/dashboard');
    } else {
      toast({ title: 'Erro', description: result.error, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="w-full max-w-md shadow-lg border-border bg-card">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-foreground font-bold">
            {isLogin ? "Entrar" : "Criar Conta"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-foreground">E-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="mt-1 bg-background border-border"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-foreground">Senha</Label>
              <Input
                id="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="mt-1 bg-background border-border"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Aguarde..." : isLogin ? "Entrar" : "Cadastrar"}
            </Button>
          </form>
          {/* Botão de login com Google */}
          <Button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 mt-2 border border-gray-300 bg-white text-foreground hover:bg-gray-100 shadow"
            disabled={loading}
          >
            <FcGoogle className="w-5 h-5" />
            Entrar com Google
          </Button>
          <div className="mt-4 text-center">
            <button
              type="button"
              className="text-primary underline text-sm"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
