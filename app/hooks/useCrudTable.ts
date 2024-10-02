import { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Toast } from 'primereact/toast';
import { AxiosError } from 'axios';

interface UseTableProps<T> {
    service: {
        getAll: () => Promise<any>;
        create: (data: T) => Promise<any>;
        update: (id: number, data: T) => Promise<any>;
        delete: (id: number) => Promise<any>;
    };
    initialRecord: T;
    keyField: string;
    defaultSortField?: string;
}

import { FieldValues } from 'react-hook-form';

export function useTable<T extends FieldValues>({ service, initialRecord, keyField, defaultSortField }: UseTableProps<T>) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState<boolean>(false);
    const [record, setRecord] = useState<T>(initialRecord);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [first, setFirst] = useState<number>(0);
    const [rows, setRows] = useState<number>(10);

    const toast = useRef<Toast>(null);
    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors }
    } = useForm<T>();

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const response = await service.getAll();
            setData(response.data);
        } catch (error) {
            console.error('Error al cargar los datos:', error);
        } finally {
            setLoading(false);
        }
    };

    const openNew = () => {
        setRecord(initialRecord);
        reset(initialRecord);
        setDialogVisible(true);
    };

    const hideDialog = () => {
        setDialogVisible(false);
    };

    const hideDeleteDialog = () => {
        setDeleteDialogVisible(false);
    };

    const saveRecord = async (formData: T) => {
        try {
            if ((record as any)[keyField]) {
                await service.update((record as any)[keyField], formData);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Actualizado',
                    detail: 'Registro actualizado correctamente',
                    life: 3000
                });
            } else {
                await service.create(formData);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Creado',
                    detail: 'Registro creado correctamente',
                    life: 3000
                });
            }
            loadData();
            hideDialog();
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Error: ${error.response?.data.message}`,
                    life: 3000
                });
            }
        }
    };

    const editRecord = (rowData: T) => {
        setRecord(rowData);
        reset(rowData);
        setDialogVisible(true);
    };

    const confirmDeleteRecord = (rowData: T) => {
        setRecord(rowData);
        setDeleteDialogVisible(true);
    };

    const deleteRecord = async () => {
        try {
            await service.delete((record as any)[keyField]);
            loadData();
            hideDeleteDialog();
            toast.current?.show({
                severity: 'success',
                summary: 'Eliminado',
                detail: 'Registro eliminado correctamente',
                life: 3000
            });
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Error: ${error.response?.data.message}`,
                    life: 3000
                });
            }
        }
    };

    const onPage = (event: { first: number; rows: number }) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    return {
        data,
        loading,
        dialogVisible,
        deleteDialogVisible,
        record,
        openNew,
        hideDialog,
        hideDeleteDialog,
        saveRecord,
        editRecord,
        confirmDeleteRecord,
        deleteRecord,
        onPage,
        globalFilter,
        setGlobalFilter,
        first,
        rows,
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        toast,
        errors,
        setRecord,
        setDialogVisible
    };
}
