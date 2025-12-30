import { z } from 'zod';

export const loginSchema = z.object({
    correo: z.string().email('Ingresa un correo electrónico válido'),
    contrasena: z.string().min(1, 'La contraseña es requerida')
});

export const registerSchema = z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    correo: z.string().email('Ingresa un correo electrónico válido'),
    contrasena: z.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/[A-Z]/, 'La contraseña debe contener al menos una mayúscula')
        .regex(/[0-9]/, 'La contraseña debe contener al menos un número'),
    confirmPassword: z.string()
}).refine((data) => data.contrasena === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
});
