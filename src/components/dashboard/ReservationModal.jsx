
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter as ModalFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/components/ui/use-toast";

const ReservationModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [reservation, setReservation] = useState({ date: '', time: '', customerName: '', numPeople: '', tableNumber: '' });
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setReservation(initialData);
    } else {
      setReservation({ date: '', time: '', customerName: '', numPeople: '', tableNumber: '' });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservation(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reservation.date || !reservation.time || !reservation.customerName || !reservation.numPeople) {
        toast({ title: "Campos Obrigatórios", description: "Data, hora, nome e nº de pessoas são obrigatórios.", variant: "destructive" });
        return;
    }
    onSave(reservation);
    setReservation({ date: '', time: '', customerName: '', numPeople: '', tableNumber: '' }); // Reset after save
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary">Nova Reserva</DialogTitle>
          <DialogDescription>Preencha os dados para a reserva da mesa.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <Label htmlFor="res-date">Data</Label>
            <Input id="res-date" name="date" type="date" value={reservation.date} onChange={handleChange} className="mt-1 bg-background" />
          </div>
          <div>
            <Label htmlFor="res-time">Hora</Label>
            <Input id="res-time" name="time" type="time" value={reservation.time} onChange={handleChange} className="mt-1 bg-background" />
          </div>
          <div>
            <Label htmlFor="res-name">Nome do Cliente</Label>
            <Input id="res-name" name="customerName" value={reservation.customerName} onChange={handleChange} className="mt-1 bg-background" />
          </div>
          <div>
            <Label htmlFor="res-people">Nº de Pessoas</Label>
            <Input id="res-people" name="numPeople" type="number" value={reservation.numPeople} onChange={handleChange} className="mt-1 bg-background" />
          </div>
          <div>
            <Label htmlFor="res-table">Nº da Mesa (opcional)</Label>
            <Input id="res-table" name="tableNumber" type="number" value={reservation.tableNumber} onChange={handleChange} placeholder="Ex: 5" className="mt-1 bg-background" />
          </div>
          <ModalFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">Salvar Reserva</Button>
          </ModalFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationModal;
