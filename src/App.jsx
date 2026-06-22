import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import heroImg from './assets/hero.png';
import './App.css';
import { data, schedule, interval } from './data';
import { HeatGanttBB } from './HeatGanttBB';
import { GanttChart } from './GanttChart';

function App() {
  return (
    <>
      <div className="ticks">
        <p>
          O objetivo deste gráfico é mostrar a variação do início e término das
          atividades após a execução da Simulação Monte Carlo. Ele é um gráfico
          de Gantt em cima de um gráfico de barras com degradê conforme a
          variação da duração das atividades e, consequentemente, variação do
          início e término delas.
        </p>
        <p>
          Um gráfico de Gantt mostra o início e término das atividades isso pode
          ser visto pelas barras. O comprimento delas indica a duração da
          atividade. Quando a atividade não tem duração, ela é um marco,
          simbolizada por um losango.
        </p>
        <p>
          Outra informação importantíssima no gráfico de Gantt é saber quais são
          as atividades críticas do cronogramas. O caminho crítico está
          representado na cor vermelha. As atividades que fazem parte do caminho
          crítico impactam diretamente na duração do projeto, refletindo
          qualquer atraso ou adiantamento.
        </p>
        <p>
          Então, como podemos mostrar num gráfico de Gantt a variabilidade do
          início e término das atividades? É isso que o próximo gráfico mostra.
        </p>
        <section id="next-steps">
          <GanttChart
            data={data}
            schedule={schedule}
            interval={interval}
            width={1000}
            height={600}
          />
        </section>
      </div>
      <div className="ticks">
        <p>
          Aí entra o gráfico HeatGantt, que mostra a variabilidade de início e
          término das atividades no tom azul, com degradê. Quanto mais escuro,
          mais vezes a atividade foi executada no período indicado nas
          simulações.
        </p>
        <p>
          O gráfico HeatGantt foi criado especialmente para mostrar um mapa de
          calor da simulação de cada atividade.
        </p>
        <p>
          Ele foi criado como trabalho final do curso{' '}
          <a href="https://www.react-graph-gallery.com/react-d3-dataviz-course">
            D3 Loves React
          </a>
          , ministrado por Yan Holtz.
        </p>
        <section id="next-steps">
          <HeatGanttBB
            data={data}
            schedule={schedule}
            interval={interval}
            width={1000}
            height={600}
          />
        </section>
        <p>
          Para simular a duração de cada atividade foi utilizada a distribuição
          de probabilidade LogNormal. Para sua utilização é necessário a média e
          o desvio padrão. Para esses cálculos foi definieo um coeficiente de
          variação de 30%, a partir do qual foi calculado o desvio padrão. Para
          a média, foi considerada a duração estimada da atividade.
        </p>
        <p>
          Com esses parâmetro, foram geradas 10.000 durações para cada atividade
          e calculado o início e término de cada uma aplicando o método do
          caminho crítico. Como a cada iteração o início e término das ativides
          mudam, foi utilizado o HeatGantt para mostrar essas variações.
        </p>
        <p></p>
        <p>
          Meu nome é Rubens José Rosa e fico à disposição para esclarecimentos
          de de quaisquer dúvidas pelo e-mail rubensjrosa@gmail.com.
        </p>
        <p></p>
      </div>
    </>
  );
}

export default App;
