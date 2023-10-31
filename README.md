# Resolução avaliação técnica Lucas Queiroga

<a id="sumario"></a>

## Sumário

<!-- TOC -->

- [Introdução](#introduction)
- [Configuração](#config)
- [Tipos de Endpoints](#tiposendpoints)
- [Endpoints](#endpoints)

<!-- /TOC -->

<a id="introduction"></a>

## 1. Introdução

Essa aqui é a minha resolução para o teste técnico como desenvolvedor pleno para a OzMap.

Foi algo muito legal de trabalhar e de conseguir fazer as interações pedidas.

Dei o meu máximo nesses dias no qual me dediquei a esse teste e espero que o resultado seja satisfatório :D

Essa API executa 3 tarefas:

1. Lê e trata dados vindos de um arquivo xls
2. Salva os arquivos tratados dentro do mongoDB
3. Envia os dados organizados e tratados para a base OzMap

<a id="config"></a>

## 2. Configuração

Nós temos o docker para facilitar a execução do app, então você poderá adicionar as variáveis sensíveis e executar o docker-compose

Para saber todas as variáveis pedidas pelo app, você pode ver em .env.local. Nós temos 4 variáveis de ambiente que você precisa configurar:

1. PORT: Você poderá colocar a porta que preferir ou terá a porta como 3001
2. DB_URI: Coloque a uri de conexão do bando mongo, você pode se baser na uri padrão (mongodb://<host>:<port>/<database-name>)
3. Project: O seu projeto dentro da base OzMap, que é disponibilizada de forma individual
4. Authorization: A chave individual para dar acesso a base OzMap

Com essas variáveis configuradas você poderá rodar tanto localmente quanto no docker.

Para rodar localmente depois de configurar as variáveis de ambiente, você vai precisar dar um "npm install" e ter o mongoDB na sua máquina. E após isso, você precisa apenas dar um "npm run dev" e estará rodando o projeto.

Para fazer a verificação dos testes com jest você precisa apenas dar "npm test" depois do projeto configurado, que ele vai rodar todos os testes e retornar o resultado.

<a id="tiposendpoints"></a>

## 3. Tipos de Endpoints

Na API temos dois tipos de endpoints, read-xls & save.

Os endpoints com começo read-xls são responsáveis por ler e salvar no banco cada uma das tabelas no arquivo xls.

Os endpoints com começo save servem para enviar as informações para a base de dados OzMap com base nas informações salvas no banco anteriormente.

Teremos erros com status 400 e 500 em toda a aplicação, assim como o status 200 quando a requisição for feita com sucesso.

<a id="endpoints"></a>

## 4. Endpoints

1. /read-xls/boxes - Vai ler e salvar os boxes no banco de dados retornando no corpo de resposta o status 200 e dois itens:
   message: Mensagem indicando o sucesso
   Boxes: Todos os itens que foram inseridos

2. /read-xls/splitters - Vai ler e salvar os splitters no banco de dados retornando no corpo de resposta o status 200 e dois itens:
   message: Mensagem indicando o sucesso
   Splitters: Todos os itens que foram inseridos

3. /read-xls/clients - Vai ler e salvar os clients no banco de dados retornando no corpo de resposta o status 200 e dois itens:
   message: Mensagem indicando o sucesso
   Clients: Todos os itens que foram inseridos

4. /save/boxes - Vai enviar para a base de dados OzMap todos os boxes salvos no banco. Só pode ser chamada depois de existir boxes no banco. Retornando no corpo de resposta o status 200 e uma mensagem indicando o sucesso

5. /save/splitters - Vai enviar para a base de dados OzMap todos os splitters salvos no banco. Só pode ser chamada depois de existir boxes & splitters no banco. Retornando no corpo de resposta o status 200 e uma mensagem indicando o sucesso

6. /save/clients - Vai enviar para a base de dados OzMap todos os clients salvos no banco (Os clients são criados através de properties, então é criado ao mesmo tempo na OzMap um imóvel e um cliente). Só pode ser chamada depois de existir boxes, splitters & clients no banco. Retornando no corpo de resposta o status 200 e uma mensagem indicando o sucesso
