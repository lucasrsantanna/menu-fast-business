import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users as UsersIcon, PlusCircle, Edit2, Trash2, ShieldCheck } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { getFirestore, collection, addDoc, doc, setDoc, deleteDoc, onSnapshot, query } from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";

const roles = ['Dono', 'Atendente', 'Cozinha', 'Marketing'];
const permissionOptions = [
  { id: 'view_only', label: 'Visualização Apenas' },
  { id: 'view_orders', label: 'Ver Pedidos' },
  { id: 'update_orders', label: 'Atualizar Pedidos' },
  { id: 'manage_products', label: 'Gerenciar Produtos' },
  { id: 'schedule_posts', label: 'Agendar Postagens' },
  { id: 'view_reports', label: 'Visualizar Relatórios' },
  { id: 'access_settings', label: 'Acessar Configurações' },
  { id: 'manage_users', label: 'Gerenciar Usuários' },
  { id: 'access_whatsapp', label: 'Acessar WhatsApp' },
];

const UserForm = ({ user, onSubmit, onCancel }) => {
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(user ? user.role : roles[1]);
  const [permissions, setPermissions] = useState(user ? user.permissions : []);
  const { toast } = useToast();

  const handlePermissionChange = (permissionId) => {
    setPermissions(prev =>
      prev.includes(permissionId) ? prev.filter(p => p !== permissionId) : [...prev, permissionId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || (!user && !password) || !role) {
      toast({ title: "Erro de Validação", description: "Nome, email, senha (para novo usuário) e cargo são obrigatórios.", variant: "destructive" });
      return;
    }
    const newUserData = { id: user ? user.id : `u${Date.now()}`, name, email, role, permissions };
    if (!user || password) newUserData.password = password; // Only add password if new user or password is changed
    onSubmit(newUserData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-1">
      <div>
        <Label htmlFor="userName" className="text-foreground">Nome Completo</Label>
        <Input id="userName" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 bg-background border-border focus:ring-primary" />
      </div>
      <div>
        <Label htmlFor="userEmail" className="text-foreground">E-mail</Label>
        <Input id="userEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 bg-background border-border focus:ring-primary" />
      </div>
      <div>
        <Label htmlFor="userPassword">{user ? 'Nova Senha (deixe em branco para não alterar)' : 'Senha Inicial'}</Label>
        <Input id="userPassword" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 bg-background border-border focus:ring-primary" />
      </div>
      <div>
        <Label htmlFor="userRole" className="text-foreground">Cargo</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-full mt-1 bg-background border-border focus:ring-primary">
            <SelectValue placeholder="Selecionar Cargo" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-foreground">Permissões</Label>
        <div className="mt-2 space-y-2 max-h-48 overflow-y-auto p-2 border border-border rounded-md">
          {permissionOptions.map(opt => (
            <div key={opt.id} className="flex items-center space-x-2">
              <Checkbox id={`perm-${opt.id}`} checked={permissions.includes(opt.id) || permissions.includes('all')} onCheckedChange={() => handlePermissionChange(opt.id)} disabled={permissions.includes('all') && opt.id !== 'all'} className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground focus-visible:ring-primary" />
              <Label htmlFor={`perm-${opt.id}`} className="text-sm font-normal text-foreground">{opt.label}</Label>
            </div>
          ))}
           <div key="all" className="flex items-center space-x-2 pt-2 border-t border-border mt-2">
              <Checkbox id="perm-all" checked={permissions.includes('all')} onCheckedChange={() => handlePermissionChange('all')} className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground focus-visible:ring-primary" />
              <Label htmlFor="perm-all" className="text-sm font-bold text-primary">Acesso Total (Dono)</Label>
            </div>
        </div>
      </div>
      <DialogFooter className="pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="border-secondary text-secondary-foreground hover:bg-secondary/20">Cancelar</Button>
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
          {user ? 'Salvar Alterações' : 'Adicionar Usuário'}
        </Button>
      </DialogFooter>
    </form>
  );
};

const UsersPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [empresaId, setEmpresaId] = useState(null);
  const { toast } = useToast();
  const db = getFirestore();

  // Obter empresaId (UID do usuário autenticado)
  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setEmpresaId(user.uid);
    });
    return () => unsubscribe();
  }, []);

  // Buscar usuários da subcoleção Firestore
  React.useEffect(() => {
    if (!empresaId) return;
    const usuariosRef = collection(db, 'empresas', empresaId, 'usuarios');
    const q = query(usuariosRef);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usuarios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usuarios);
    });
    return () => unsubscribe();
  }, [empresaId]);

  const handleAddUser = async (newUser) => {
    if (!empresaId) return;
    try {
      const usuariosRef = collection(db, 'empresas', empresaId, 'usuarios');
      await addDoc(usuariosRef, newUser);
      setIsFormOpen(false);
      toast({ title: "Sucesso!", description: "Usuário adicionado com sucesso.", className: "bg-status-ready border-status-ready text-white" });
    } catch (e) {
      toast({ title: "Erro", description: "Erro ao adicionar usuário.", variant: "destructive" });
    }
  };

  const handleEditUser = async (updatedUser) => {
    if (!empresaId || !updatedUser.id) return;
    try {
      const usuarioRef = doc(db, 'empresas', empresaId, 'usuarios', updatedUser.id);
      await setDoc(usuarioRef, updatedUser, { merge: true });
      setIsFormOpen(false);
      setEditingUser(null);
      toast({ title: "Sucesso!", description: "Usuário atualizado com sucesso." });
    } catch (e) {
      toast({ title: "Erro", description: "Erro ao atualizar usuário.", variant: "destructive" });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!empresaId || !userId) return;
    try {
      const usuarioRef = doc(db, 'empresas', empresaId, 'usuarios', userId);
      await deleteDoc(usuarioRef);
      toast({ title: "Usuário Removido", description: "O usuário foi removido com sucesso.", variant: "destructive" });
    } catch (e) {
      toast({ title: "Erro", description: "Erro ao remover usuário.", variant: "destructive" });
    }
  };

  const openEditForm = (user) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };
  
  const openNewForm = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  return (
    <div className="p-4 md:p-6">
      <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Usuários</h1>
          <p className="text-muted-foreground">Gerencie os acessos e permissões dos usuários do sistema.</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewForm} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
              <PlusCircle className="mr-2 h-4 w-4" /> Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0 bg-background border-border">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-2xl font-semibold text-primary">
                {editingUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {editingUser ? 'Atualize os dados e permissões do usuário.' : 'Preencha os dados para criar um novo acesso.'}
              </DialogDescription>
            </DialogHeader>
            <div className="p-6">
              <UserForm user={editingUser} onSubmit={editingUser ? handleEditUser : handleAddUser} onCancel={() => { setIsFormOpen(false); setEditingUser(null); }} />
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <Card className="shadow-md bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2"><UsersIcon className="h-6 w-6 text-primary" /> Lista de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-foreground">Nome</TableHead>
                <TableHead className="text-foreground">E-mail</TableHead>
                <TableHead className="text-foreground">Cargo</TableHead>
                <TableHead className="text-right text-foreground">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">Nenhum usuário cadastrado.</TableCell>
                </TableRow>
              )}
              {users.map(user => (
                <TableRow key={user.id} className="border-border">
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => openEditForm(user)}><Edit2 className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDeleteUser(user.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Mensagem quando não há usuários cadastrados */}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
