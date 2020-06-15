export class Tripulacion {
    patente: string;
    tripulacion: PersonalParaEnvio[];
}

export class PersonalParaEnvio {
    id_persona: number;
    nombre_persona: string;
    apellido_persona: string;
}