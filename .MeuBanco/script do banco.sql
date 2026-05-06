CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    estado VARCHAR(2),
    cidade VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,
    eco_beneficios INTEGER NOT NULL DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE seguidores (
    id SERIAL PRIMARY KEY,
    seguidor_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    seguindo_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (seguidor_id, seguindo_id),
    CHECK (seguidor_id <> seguindo_id)
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    legenda TEXT,
    midia_url TEXT NOT NULL,
    tipo_midia VARCHAR(20) NOT NULL DEFAULT 'foto',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE curtidas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (usuario_id, post_id)
);

CREATE TABLE comentarios (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    comentario TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE compartilhamentos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conversas (
    id SERIAL PRIMARY KEY,
    usuario_1_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    usuario_2_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (usuario_1_id <> usuario_2_id)
);

CREATE TABLE mensagens (
    id SERIAL PRIMARY KEY,
    conversa_id INTEGER NOT NULL REFERENCES conversas(id) ON DELETE CASCADE,
    remetente_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    mensagem TEXT NOT NULL,
    lida BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE missoes (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    recompensa INTEGER NOT NULL DEFAULT 0,
    total_acoes INTEGER NOT NULL DEFAULT 1,
    local VARCHAR(150),
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE usuarios_missoes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    missao_id INTEGER NOT NULL REFERENCES missoes(id) ON DELETE CASCADE,
    progresso INTEGER NOT NULL DEFAULT 0,
    concluida BOOLEAN NOT NULL DEFAULT FALSE,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (usuario_id, missao_id)
);

CREATE TABLE eco_beneficios_historico (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    missao_id INTEGER REFERENCES missoes(id) ON DELETE SET NULL,
    post_id INTEGER REFERENCES posts(id) ON DELETE SET NULL,
    descricao VARCHAR(200) NOT NULL,
    pontos INTEGER NOT NULL,
    tipo VARCHAR(30) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE notificacoes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    remetente_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    comentario_id INTEGER REFERENCES comentarios(id) ON DELETE CASCADE,
    mensagem_id INTEGER REFERENCES mensagens(id) ON DELETE CASCADE,
    missao_id INTEGER REFERENCES missoes(id) ON DELETE SET NULL,
    titulo VARCHAR(150),
    mensagem TEXT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    lida BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP

	
);

------------------------------------Novas Tabelas-------------------------------------------------------------------------------------------------------


CREATE TABLE mapa_verde_pontos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    tipo VARCHAR(80) NOT NULL,
    descricao TEXT,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    recompensa INTEGER NOT NULL DEFAULT 0,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE configuracoes_privacidade (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER UNIQUE NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    perfil_privado BOOLEAN NOT NULL DEFAULT FALSE,
    ocultar_localizacao BOOLEAN NOT NULL DEFAULT TRUE,
    status_invisivel BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE configuracoes_seguranca (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER UNIQUE NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    autenticacao_duas_etapas BOOLEAN NOT NULL DEFAULT FALSE,
    alertas_login BOOLEAN NOT NULL DEFAULT TRUE,
    filtro_mensagens BOOLEAN NOT NULL DEFAULT TRUE
);

------------------------------------Atualizacoes-------------------------------------------------------------------------------------------------------

UPDATE usuarios
SET telefone = regexp_replace(telefone, '\D', '', 'g')
WHERE telefone IS NOT NULL;

ALTER TABLE usuarios
ALTER COLUMN email TYPE VARCHAR(100),
ALTER COLUMN senha TYPE TEXT,
ALTER COLUMN telefone TYPE CHAR(11) USING telefone::CHAR(11);

ALTER TABLE usuarios
ADD CONSTRAINT usuarios_telefone_brasil_check
CHECK (telefone ~ '^[1-9][0-9]{10}$');
