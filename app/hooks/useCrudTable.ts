'use client';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Toast } from 'primereact/toast';
import { AxiosError } from 'axios';

interface CrudParams {
    service: any; // El servicio que manejará las operaciones (crear, actualizar, eliminar, listar)
    emptyRecord: any; // El objeto vacío que inicializa un registro
    queryKey: string; // Clave para el cache de React Query
    filters?: object; // Filtros iniciales
}

export const useCrud = ({ service, emptyRecord, queryKey, filters = {} }: CrudParams) => {
    const [record, setRecord] = useState(emptyRecord);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const toast = useRef<Toast>(null);
    const queryClient = useQueryClient();
    const { control, handleSubmit, setValue, reset } = useForm();

    // Estado de la paginación y filtros
    const [lazyState, setLazyState] = useState({
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: filters
    });

    // Obtener registros con paginación usando React Query
    const { data, isLoading } = useQuery({
        queryKey: [queryKey, lazyState.page, lazyState.rows, lazyState.filters],
        queryFn: () => service.getPaginacion(lazyState.page, lazyState.rows, lazyState.filters),
        staleTime: 5000
    });

    // Abrir formulario para crear nuevo registro
    const openNew = () => {
        setRecord(emptyRecord);
        reset(emptyRecord); // Limpiar el formulario
        setDialogVisible(true);
    };

    // Editar un registro
    const editRecord = (record: any) => {
        setRecord(record);
        Object.keys(record).forEach((field) => {
            setValue(field, record[field]);
        });

        setDialogVisible(true);
    };

    // Cerrar los diálogos
    const hideDialog = () => {
        reset(emptyRecord);
        setDialogVisible(false);
    };

    const hideDeleteDialog = () => setDeleteDialogVisible(false);

    // Guardar un registro (crear o actualizar)
    const saveRecord = async (data: any) => {
        if (record.id) {
            // Actualizar
            try {
                await service.putActualizar(record.id, data);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Actualizado',
                    detail: 'Registro actualizado correctamente',
                    life: 3000
                });
            } catch (error) {
                if (error instanceof AxiosError) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: `Error al actualizar: ${error.response?.data.message}`,
                        life: 3000
                    });
                }
            }
        } else {
            // Crear nuevo
            try {
                await service.postCrear(data);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Creado',
                    detail: 'Registro creado correctamente',
                    life: 3000
                });
            } catch (error) {
                if (error instanceof AxiosError) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: `Error al crear: ${error.response?.data.message}`,
                        life: 3000
                    });
                }
            }
        }

        queryClient.invalidateQueries({ queryKey: [queryKey] });
        setDialogVisible(false);
    };

    // Eliminar un registro
    const deleteMutation = useMutation({
        mutationFn: (id: number) => service.deleteEliminar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKey] });
            toast.current?.show({
                severity: 'success',
                summary: 'Eliminado',
                detail: 'Registro eliminado correctamente',
                life: 3000
            });
        },
        onError: (error: AxiosError) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: `Error al eliminar: ${(error.response?.data as { message: string }).message}`,
                life: 3000
            });
        }
    });

    const confirmDeleteRecord = (record: any) => {
        setRecord(record);
        setDeleteDialogVisible(true);
    };

    const deleteRecord = () => {
        deleteMutation.mutate(record.id);
        setDeleteDialogVisible(false);
    };

    return {
        record,
        data,
        isLoading,
        dialogVisible,
        deleteDialogVisible,
        openNew,
        editRecord,
        setRecord,
        setDialogVisible,
        confirmDeleteRecord,
        saveRecord,
        deleteRecord,
        hideDialog,
        hideDeleteDialog,
        lazyState,
        setLazyState,
        control,
        handleSubmit,
        toast
    };
};
