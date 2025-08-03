create database db_inv_ti;
USE db_inv_ti;

create table areas(
	area varchar (100) primary key
);

create table estado_equipo(
    estado varchar (50) primary key
);

create table usuarios (
    usuario varchar (20) primary key,
    contrasena varchar (10) not null,
    nombre varchar (200) not null,
    area varchar (100) not null,
    correo varchar (50) null,
    estado varchar (15) not null
);

create table equipos(
    num_serie varchar(50) primary key,
    equipo varchar(100) not null,
    area varchar(100) not null,
    descripcion text,
    estado varchar(50) not null,
    responsable varchar(20) null,
    fecha_adquisicion date not null,
    fecha_asignacion date not null,
    fecha_baja date null
);

create table historial_mantenimientos(
    id_historial varchar(100) primary key,
    num_serie varchar(50) not null,
    fecha_reporte date not null,
    fecha_solucion date null,
    usuario_tecnico varchar(20) null,
    falla text not null,
    solucion text null
);

create table productos(
    codigo varchar(50) primary key,
    nom_producto varchar(100) not null,
    desc_producto text not null,
    pre_publico double not null,
    pre_proveedor double not null,
    existencias int not null
);

create table ventas(
    id_venta varchar(150) primary key,
    productos text not null,
    total_venta double not null,
    fecha_venta date not null,
    vendedor varchar(20) not null
);

insert into areas (area) values
('tecnoiogia'),
('administracion'),
('recursos humanos'),
('finanzas'),
('soporte'),
('almacen'),
('ventas');

insert into productos (codigo, nom_producto,desc_producto, pre_publico, pre_proveedor, existencias) values
('H001', 'Detergente Liquido Ariel 4.65L', 'Detergente liquido para ropa con poder quita manchas', 120.00, 100.00, 12),
('H002', 'Papel Higienico Regio 32 Rollos', 'Papel higienico doble hoja, ultra suave, paquete economico', 189.00, 150.00, 15),
('H003', 'Fabuloso Lavanda 1.8L', 'Limpiador multiuso con aroma a lavanda, ideal para pisos y superficies', 35.00, 20.00, 42),
('H004', 'Esponja Scotch-Brite Pack x3', 'Esponjas multiusos resistentes para cocina y bano', 28.00, 18.00, 80),
('H005', 'Trapeador Microfibra con Palo', 'Trapeador ultra absorbente con cabeza giratoria', 75.00, 50.00, 35),
('H006', 'Juego de 6 Vasos de Vidrio', 'Vasos resistentes y elegantes para bebidas frias', 95.00, 70.00, 20),
('H007', 'Sarten Antiadherente 24cm', 'Sarten de aluminio con recubrimiento antiaderente y mango ergonomico', 120.00, 105.00, 31),
('H008', 'Ambiertador Glade Manzana Canela', 'Aerosol aromatizante para el hogar', 32.00, 22.00, 50),
('H009', 'Cubo de Basura con Tapa 25L', 'Contenedor de plastico resistente con pedal y tapa hermetica', 110.00, 80.00, 18),
('H010', 'Toalla de Cocina Absorbentes x3', 'Toallas de tela absorbente reutilizables para cocina', 48.00, 30.00, 45);

insert into estado_equipo (estado) values
('activo'),
('mantenimiento'),
('baja'),
('inactivo'),
('reservado');

INSERT INTO equipos (  num_serie, equipo, area, descripcion, estado, responsable, fecha_adquisicion, fecha_asignacion, fecha_baja) values
('E001', 'Laptop Dell XPS 13', 'tecnologia', 'Laptop de alto rendimiento para desarrollo', 'activo', 'Juan Perez', '2022-01-15', '2022-01-20', NULL),
('E002', 'Monitor Samsung 27"', 'tecnologia', 'Monitor 4K de 27 pulgadas', 'activo', NULL, '2021-12-01', '2021-12-05', NULL),
('E003', 'Impresora HP LaserJet', 'administracion', 'Impresora láser color', 'activo', 'Laura Rojas', '2020-07-10', '2020-07-12', NULL),
('E004', 'Servidor Dell R740', 'tecnologia', 'Servidor para almacenamiento de datos', 'activo', NULL, '2023-03-01', '2023-03-05', NULL),
('E005', 'Escáner Canon LIDE 300', 'administracion', 'Escáner de documentos A4', 'mantenimiento', 'Carlos Jiménez', '2019-11-22', '2020-01-10', NULL),
('E006', 'Laptop Lenovo ThinkPad', 'almacen', 'Laptop para soporte a usuarios', 'mantenimiento', NULL, '2021-06-17', '2021-06-19', '2024-03-01'),
('E007', 'Proyector Epson EB-X41', 'almacen', 'Proyector multimedia para presentaciones', 'activo', 'Marta Quesada', '2022-08-11', '2022-08-15', NULL),
('E008', 'Teclado Mecánico Logitech', 'tecnologia', 'Teclado mecánico para desarrollo', 'activo', NULL, '2024-01-02', '2024-01-03', NULL),
('E009', 'Router Cisco 2900', 'tecnologia', 'Router para red corporativa', 'mantenimiento', 'Jorge Castro', '2020-02-10', '2020-02-15', '2023-10-10'),
('E010', 'Tablet Samsung Galaxy Tab', 'administracion', 'Tablet para gestión de tareas', 'activo', 'Daniela Vargas', '2023-09-10', '2023-09-15', NULL);
