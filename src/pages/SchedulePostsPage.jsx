import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import SchedulePostForm from '@/components/schedule/SchedulePostForm';
import PostList from '@/components/schedule/PostList';
import PostResultsModal from '@/components/schedule/PostResultsModal';
import ScheduleCalendar from '@/components/schedule/ScheduleCalendar';
import { getFirestore, collection, addDoc, doc, setDoc, deleteDoc, onSnapshot, query } from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";

const SchedulePostsPage = () => {
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingPost, setEditingPost] = useState(null);
	const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
	const [selectedPostForResults, setSelectedPostForResults] = useState(null);
	const [posts, setPosts] = useState([]);
	const [empresaId, setEmpresaId] = useState(null);
	const db = getFirestore();
	const { toast } = useToast();

	// Obter empresaId (UID do usuário autenticado)
	React.useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) setEmpresaId(user.uid);
		});
		return () => unsubscribe();
	}, []);

	// Buscar posts agendados da subcoleção Firestore
	React.useEffect(() => {
		if (!empresaId) return;
		const postsRef = collection(db, 'empresas', empresaId, 'postsAgendados');
		const q = query(postsRef);
		const unsubscribe = onSnapshot(q, (snapshot) => {
			const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
			setPosts(postsData);
		});
		return () => unsubscribe();
	}, [empresaId]);

	const handleAddPost = async (newPost) => {
		if (!empresaId) return;
		try {
			const postsRef = collection(db, 'empresas', empresaId, 'postsAgendados');
			await addDoc(postsRef, newPost);
			setIsFormOpen(false);
			toast({ title: "Sucesso!", description: "Post agendado com sucesso.", className: "bg-status-ready border-status-ready text-white" });
		} catch (e) {
			toast({ title: "Erro", description: "Erro ao agendar post.", variant: "destructive" });
		}
	};

	const handleEditPost = async (updatedPost) => {
		if (!empresaId || !updatedPost.id) return;
		try {
			const postRef = doc(db, 'empresas', empresaId, 'postsAgendados', updatedPost.id);
			await setDoc(postRef, updatedPost, { merge: true });
			setIsFormOpen(false);
			setEditingPost(null);
			toast({ title: "Sucesso!", description: "Agendamento atualizado com sucesso." });
		} catch (e) {
			toast({ title: "Erro", description: "Erro ao atualizar agendamento.", variant: "destructive" });
		}
	};

	const handleDeletePost = async (postId) => {
		if (!empresaId || !postId) return;
		try {
			const postRef = doc(db, 'empresas', empresaId, 'postsAgendados', postId);
			await deleteDoc(postRef);
			toast({ title: "Removido!", description: "Post removido com sucesso.", variant: "destructive" });
		} catch (e) {
			toast({ title: "Erro", description: "Erro ao remover post.", variant: "destructive" });
		}
	};

	const openEditForm = (post) => {
		setEditingPost(post);
		setIsFormOpen(true);
	};

	const openNewForm = () => {
		setEditingPost(null);
		setIsFormOpen(true);
	};

	const openResultsModal = (post) => {
		setSelectedPostForResults(post);
		setIsResultsModalOpen(true);
	};
	
	const getCombinedPostDates = (post) => {
		let dates = [new Date(post.dateTime)];
		if (post.recurrence === 'custom' && post.customDates && post.customDates.length > 0) {
			dates = [...dates, ...post.customDates.map(d => new Date(d))];
		}
		return dates;
	};

	return (
		<div className="p-4 md:p-6">
			<header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-foreground">Agendar Posts</h1>
					<p className="text-muted-foreground">Crie, programe e acompanhe posts para várias redes.</p>
				</div>
				<Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if (!isOpen) setEditingPost(null); }}>
					<DialogTrigger asChild>
						<Button onClick={openNewForm} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-transform hover:scale-105">
							<PlusCircle className="mr-2 h-4 w-4" /> Agendar Post
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-2xl md:max-w-3xl max-h-[90vh] overflow-y-auto p-0 bg-background border-border">
						<DialogHeader className="p-6 pb-0">
							<DialogTitle className="text-2xl font-semibold text-primary">
								{editingPost ? 'Editar Agendamento' : 'Novo Agendamento de Post'}
							</DialogTitle>
							<DialogDescription className="text-muted-foreground">
								{editingPost ? 'Atualize os detalhes do agendamento.' : 'Preencha as informações para o novo post.'}
							</DialogDescription>
						</DialogHeader>
						<div className="p-6">
							<SchedulePostForm 
								post={editingPost} 
								onSubmit={editingPost ? handleEditPost : handleAddPost}
								onCancel={() => { setIsFormOpen(false); setEditingPost(null); }}
							/>
						</div>
					</DialogContent>
				</Dialog>
			</header>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="space-y-6 flex flex-col items-center justify-center">
					<ScheduleCalendar 
						currentMonth={currentMonth}
						setCurrentMonth={setCurrentMonth}
						daysWithPosts={posts.map(post => new Date(post.dateTime))}
					/>
				</div>

				<div>
					<PostList 
						posts={posts}
						currentMonth={currentMonth}
						onEditPost={openEditForm}
						onViewResults={openResultsModal}
						onDeletePost={handleDeletePost}
					/>
				</div>
			</div>
			
			{selectedPostForResults && (
				<PostResultsModal
					isOpen={isResultsModalOpen}
					onClose={() => setIsResultsModalOpen(false)}
					post={selectedPostForResults}
				/>
			)}
		</div>
	);
};

export default SchedulePostsPage;
