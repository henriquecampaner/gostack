# Recuperacao de senha
**RF** Requisitos funcionais
- O usuario deve poder recuperar sua senha informando seu email;
- O usuario deve receber um e-mail com instrucoes de recuperacao de senhas;
- O usuario deve poder resetar sua senha;

**RNF** Requisitos nao funcionais
- Utilizar Mailtrap para testar envio em desenvolvimento;
- Utilizar Amazon SES para envios em producao;
- O envio de emails deve acontecer em segunda plano;

**RN**
- O link enviado por email de recuperaco de senha, deve expirar em 2h;
- O usuario precisa confirmar a nova senha ao resetar;

# Atualizaco do perfil

**RF**
- O usuario de poder atualizar seu nome, email e senha;

**RNF**

**RN**
- O usuario nao pode alterar seu email para um email ja existente;
- Para atualizar sua senha o usuario deve informar sua senha antiga;
- Para atualizar sua senha o usuario deve informar novamente a senha;

# Painel do Prestador

**RF**
- O usuario deve poder listar seus agendamentos de um dia especifico;
- O prestador deve receber uma notificacao sempre que houver um novo agendamento;
- O prestador deve poder visualizar as notificacoes nao lidas;

**RNF**
- Os agendamentos do prestador no dia devem ser armazenados em cache;
- As notificacoes do prestador devem ser armazenadas no MongoDB;
- As notificacoes do prestador devem ser enviadas em tempo-real utilizando Socket.io;

**RN**
- A notificacao deve ter um status de lida ou nao lida para que o prestador possa controlar;

# Agendamento Servicos

**RF**
- O usuario deve poder listar todos os prestadores de servicos cadastrados;
- O usuario deve poder listar os dias de um mes com ao menos um horario disponivel de um prestador;
- O usuario deve poder listar horarios disponiveis em um dia especifico de um prestador;
- O usuario deve poder realizar um novo agendamento com um prestador;

**RNF**
- A listagem de prestadores deve ser armazenado em cache;

**RN**
- Cada agendamento deve durar 1hora;
- Os agendamentos devem estar disponiveis entre as 8h as 18hr (ultimo as 17hr);
- O usuario nao pode agendar em um horario ja ocupado;
- O usuario nao pode agendar em um horario que ja passou;
- O usuario nao pode agendar servicos consigo mesmo;
