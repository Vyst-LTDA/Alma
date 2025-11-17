import React from 'react';
import { ArrowUturnLeftIcon } from '../../../../components/shared/IconComponents';

interface ScriptingGuideProps {
    onBack: () => void;
}

const CodeBlock: React.FC<{ language: string; children: React.ReactNode }> = ({ language, children }) => (
    <div className="bg-gray-800 text-white p-4 rounded-lg my-4 relative">
        <span className="absolute top-2 right-2 text-xs text-gray-400 uppercase font-semibold">{language}</span>
        <pre><code className={`language-${language}`}>{children}</code></pre>
    </div>
);

const ScriptingGuide: React.FC<ScriptingGuideProps> = ({ onBack }) => {
    return (
        <div className="bg-light-card p-6 md:p-8 rounded-xl border border-gray-200 h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Voltar">
                    <ArrowUturnLeftIcon className="w-6 h-6 text-dark-text" />
                </button>
                <h2 className="text-2xl font-bold text-dark-text">Guia de Scripting da Plataforma</h2>
            </div>
            <div className="prose max-w-none flex-grow overflow-y-auto pr-2 text-dark-text">
                <p>Este guia fornece uma visão geral de como criar e usar scripts para estender a funcionalidade da plataforma.</p>

                <h3>Visão Geral</h3>
                <p>A plataforma de scripting permite que você injete lógica de negócios personalizada em pontos específicos do sistema, conhecidos como "hooks". Você pode escrever scripts em JavaScript (ES5) ou Python.</p>

                <h3>Estrutura de um Script</h3>
                <p>Todo script deve definir uma função chamada <code>handle</code>. Esta função recebe um objeto <code>context</code>, que contém os dados relevantes para o hook em que o script está sendo executado.</p>

                <CodeBlock language="javascript">
{`function handle(context) {
    // Sua lógica aqui
    log.info('Script executado com sucesso!');
    return context;
}`}
                </CodeBlock>

                <CodeBlock language="python">
{`def handle(context):
    # Sua lógica aqui
    log.info('Script executado com sucesso!')
    return context`}
                </CodeBlock>
                
                <h3>A API Global</h3>
                <p>Todos os scripts têm acesso a um conjunto de funções globais para interagir com o sistema.</p>
                <h4>Log</h4>
                <p>Você pode registrar mensagens usando o objeto <code>log</code> global.</p>
                <ul>
                    <li><code>log.info(message)</code>: Registra uma mensagem informativa.</li>
                    <li><code>log.warn(message)</code>: Registra um aviso.</li>
                    <li><code>log.error(message)</code>: Registra um erro.</li>
                </ul>

                <h4>HTTP</h4>
                <p>Você pode fazer chamadas HTTP para domínios pré-aprovados usando o objeto <code>http</code> global.</p>
                <ul>
                    <li><code>http.get(url)</code>: Faz uma requisição GET para a URL especificada e retorna o corpo da resposta como uma string.</li>
                    <li><code>http.post(url, content)</code>: Faz uma requisição POST para a URL especificada com o corpo do conteúdo fornecido e retorna o corpo da resposta como uma string.</li>
                </ul>

                <h3>O Objeto <code>context</code></h3>
                <p>O objeto <code>context</code> é o principal meio de interação entre seu script e a plataforma. Ele contém os dados que estão sendo processados no momento em que o hook é acionado.</p>
                <ul>
                    <li><strong>Hooks <code>before:*</code></strong>: Em hooks que são executados <em>antes</em> de uma operação (por exemplo, <code>before:CreateItem</code>), você pode modificar os dados no <code>context</code>. O objeto <code>context</code> modificado deve ser retornado pela sua função <code>handle</code>. Se você não retornar nada, as modificações não serão aplicadas. Se o script falhar ou lançar uma exceção, a operação principal será abortada.</li>
                    <li><strong>Hooks <code>after:*</code></strong>: Em hooks que são executados <em>depois</em> de uma operação (por exemplo, <code>after:CreateItem</code>), o <code>context</code> contém os dados <em>resultantes</em> da operação. Modificações no <code>context</code> nestes hooks não terão efeito. Falhas nestes scripts serão registradas, mas não reverterão a operação principal.</li>
                </ul>

                <h3>Pontos de Hook Disponíveis</h3>
                <p>Aqui está uma lista dos pontos de hook atualmente disponíveis na plataforma:</p>
                <ul>
                    <li><code>before:CreateItem</code>: Acionado antes de um novo item ser criado. O objeto <code>context</code> contém os dados do <code>CreateItemCommand</code>. Você pode modificar as propriedades deste objeto.</li>
                    <li><code>after:CreateItem</code>: Acionado após um novo item ter sido criado com sucesso. O objeto <code>context</code> contém a entidade <code>Item</code> recém-criada.</li>
                </ul>

                <h3>Exemplos Práticos</h3>
                <h4>Exemplo 1: Adicionar um prefixo ao SKU de um novo item</h4>
                <p>Este script usa o hook <code>before:CreateItem</code> para adicionar o prefixo "SKU-" ao SKU de qualquer novo item, a menos que ele já comece com esse prefixo.</p>
                <CodeBlock language="javascript">
{`function handle(context) {
    var command = context.context; // O comando está aninhado dentro do objeto de contexto principal
    log.info('Executando script before:CreateItem para o item: ' + command.Sku);

    if (command.Sku && !command.Sku.startsWith('SKU-')) {
        log.info('Modificando SKU de "' + command.Sku + '" para "SKU-' + command.Sku + '"');
        command.Sku = 'SKU-' + command.Sku;
    }

    return context;
}`}
                </CodeBlock>
                 <CodeBlock language="python">
{`def handle(context):
    command = context['context'] # O comando está aninhado dentro do objeto de contexto principal
    log.info('Executando script before:CreateItem para o item: ' + command.Sku)

    if command.Sku and not command.Sku.startswith('SKU-'):
        log.info('Modificando SKU de "' + command.Sku + '" para "SKU-' + command.Sku + '"')
        command.Sku = 'SKU-' + command.Sku

    return context`}
                </CodeBlock>

                <h4>Exemplo 2: Registrar um log após a criação de um item</h4>
                <p>Este script usa o hook <code>after:CreateItem</code> para registrar uma mensagem de log personalizada assim que um novo item é criado com sucesso.</p>
                 <CodeBlock language="javascript">
{`function handle(context) {
    var item = context.context; // A entidade está aninhada dentro do objeto de contexto principal
    log.info('Item ' + item.Name + ' (ID: ' + item.Id + ') foi criado com sucesso com o SKU: ' + item.Sku);
    return context;
}`}
                </CodeBlock>
                 <CodeBlock language="python">
{`def handle(context):
    item = context['context'] # A entidade está aninhada dentro do objeto de contexto principal
    log.info('Item ' + item.Name + ' (ID: ' + str(item.Id) + ') foi criado com sucesso com o SKU: ' + item.Sku)
    return context`}
                </CodeBlock>

                <h4>Exemplo 3: Buscar dados externos ao criar um item</h4>
                <p>Este script usa o hook <code>before:CreateItem</code> e a API <code>http</code> para buscar informações de um serviço externo (neste caso, a API do GitHub) e adicioná-las ao nome do item.</p>
                <CodeBlock language="javascript">
{`function handle(context) {
    var command = context.context;
    log.info('Buscando informações para o item ' + command.Name);

    try {
        var response = http.get('https://api.github.com/zen');
        command.Name = command.Name + ' - ' + response;
    } catch (e) {
        log.error('Falha ao buscar dados externos: ' + e.message);
    }

    return context;
}`}
                </CodeBlock>
            </div>
        </div>
    );
};

export default ScriptingGuide;
