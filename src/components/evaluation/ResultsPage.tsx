import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { EvaluationData } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { toast } from '@/hooks/use-toast';
import { calculateAge } from '@/utils/ageCalculator';
import { useIsMobile } from '@/hooks/use-mobile';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ResultsPageProps {
  evaluationData: EvaluationData;
  onRestart: () => void;
  onBackToInstructions: () => void;
  onFinish: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  evaluationData,
  onRestart,
  onBackToInstructions,
  onFinish
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isChartOpen, setIsChartOpen] = useState(false);
  const isMobile = useIsMobile();
  const chartData = [{
    name: '0-11m',
    desired: 13,
    minimum: 8,
    achieved: evaluationData.scores['0 a 11 meses'] || 0
  }, {
    name: '12m',
    desired: 14,
    minimum: 9,
    achieved: evaluationData.scores['12 meses'] || 0
  }, {
    name: '18m',
    desired: 10,
    minimum: 6,
    achieved: evaluationData.scores['18 meses'] || 0
  }, {
    name: '24m',
    desired: 15,
    minimum: 9,
    achieved: evaluationData.scores['24 meses'] || 0
  }, {
    name: '3a',
    desired: 15,
    minimum: 9,
    achieved: evaluationData.scores['3 anos'] || 0
  }, {
    name: '4a',
    desired: 11,
    minimum: 7,
    achieved: evaluationData.scores['4 anos'] || 0
  }, {
    name: '5a',
    desired: 11,
    minimum: 7,
    achieved: evaluationData.scores['5 anos'] || 0
  }];

  const chronologicalAge = calculateAge(evaluationData.child.dateOfBirth);

  const handleDownloadPDF = async () => {
    try {
      // Criar container invisível com largura fixa desktop
      const pdfContainer = document.createElement('div');
      pdfContainer.style.position = 'absolute';
      pdfContainer.style.left = '-9999px';
      pdfContainer.style.top = '0';
      pdfContainer.style.width = '1200px'; // Largura fixa desktop
      pdfContainer.style.backgroundColor = '#ffffff';
      pdfContainer.style.padding = '40px';
      pdfContainer.style.boxSizing = 'border-box';
      pdfContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      
      // Clonar o conteúdo original mantendo estilos
      const originalElement = document.getElementById('pdf-content');
      if (!originalElement) return;
      
      const clonedContent = originalElement.cloneNode(true) as HTMLElement;
      
      // Manter estilos originais, apenas ajustar para largura fixa
      clonedContent.style.width = '100%';
      clonedContent.style.maxWidth = 'none';
      clonedContent.style.margin = '0';
      clonedContent.style.padding = '0';
      
      // Substituir ResponsiveContainer por gráfico com dimensões fixas para PDF
      const chartContainer = clonedContent.querySelector('.chart-container');
      if (chartContainer) {
        chartContainer.innerHTML = `
          <div style="width: 1000px; height: 550px; margin: 0 auto;">
            <svg width="1000" height="550" viewBox="0 0 1000 550" style="background: white;">
              <!-- Grid lines -->
              <defs>
                <pattern id="grid" width="60" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 30" fill="none" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="3,3"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              <!-- Chart bars and labels -->
              ${chartData.map((item, index) => {
                const x = 150 + index * 130;
                const maxValue = Math.max(item.desired, item.minimum, item.achieved);
                const scale = 350 / Math.max(...chartData.map(d => Math.max(d.desired, d.minimum, d.achieved)));
                
                const desiredHeight = item.desired * scale;
                const minimumHeight = item.minimum * scale;
                const achievedHeight = item.achieved * scale;
                
                return `
                  <!-- Desired bar -->
                  <rect x="${x - 35}" y="${430 - desiredHeight}" width="25" height="${desiredHeight}" fill="#10b981"/>
                  <text x="${x - 22}" y="${430 - desiredHeight - 5}" text-anchor="middle" font-size="12" fill="#333">${item.desired}</text>
                  
                  <!-- Minimum bar -->
                  <rect x="${x - 5}" y="${430 - minimumHeight}" width="25" height="${minimumHeight}" fill="#ef4444"/>
                  <text x="${x + 7}" y="${430 - minimumHeight - 5}" text-anchor="middle" font-size="12" fill="#333">${item.minimum}</text>
                  
                  <!-- Achieved bar -->
                  <rect x="${x + 25}" y="${430 - achievedHeight}" width="25" height="${achievedHeight}" fill="#fb923c"/>
                  <text x="${x + 37}" y="${430 - achievedHeight - 5}" text-anchor="middle" font-size="12" fill="#333">${item.achieved}</text>
                  
                  <!-- X axis label -->
                  <text x="${x}" y="460" text-anchor="middle" font-size="14" fill="#333">${item.name}</text>
                `;
              }).join('')}
              
              <!-- Legend - Centered below chart -->
              <rect x="350" y="510" width="18" height="18" fill="#10b981"/>
              <text x="375" y="524" font-size="14" fill="#333">Desejado</text>
              
              <rect x="490" y="510" width="18" height="18" fill="#ef4444"/>
              <text x="515" y="524" font-size="14" fill="#333">Mínimo</text>
              
              <rect x="630" y="510" width="18" height="18" fill="#fb923c"/>
              <text x="655" y="524" font-size="14" fill="#333">Alcançado</text>
              
              <!-- Y axis -->
              <line x1="100" y1="60" x2="100" y2="430" stroke="#333" stroke-width="1"/>
              <!-- X axis -->
              <line x1="100" y1="430" x2="900" y2="430" stroke="#333" stroke-width="1"/>
            </svg>
          </div>
        `;
      }
      
      document.body.appendChild(pdfContainer);
      pdfContainer.appendChild(clonedContent);
      
      // Aguardar renderização (aumentado para o gráfico customizado)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Capturar com largura fixa e altura automática
      const canvas = await html2canvas(pdfContainer, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 1200,
        height: pdfContainer.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        logging: false
      });
      
      // Remover container temporário
      document.body.removeChild(pdfContainer);
      
      const imgData = canvas.toDataURL('image/png', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Calcular dimensões para caber no A4
      const pageWidth = 210; // mm
      const pageHeight = 297; // mm
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calcular escala para caber na largura da página
      const scale = pageWidth / (imgWidth * 0.264583); // 0.264583 = mm por pixel
      const scaledHeight = (imgHeight * 0.264583) * scale;
      
      if (scaledHeight <= pageHeight) {
        // Cabe em uma página
        pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, scaledHeight);
      } else {
        // Múltiplas páginas
        let yOffset = 0;
        let remainingHeight = scaledHeight;
        
        while (remainingHeight > 0) {
          const sliceHeight = Math.min(pageHeight, remainingHeight);
          
          if (yOffset > 0) pdf.addPage();
          
          pdf.addImage(
            imgData, 
            'PNG', 
            0, 
            -yOffset, 
            pageWidth, 
            scaledHeight
          );
          
          yOffset += sliceHeight;
          remainingHeight -= sliceHeight;
        }
      }
      
      pdf.save(`Relatorio_Avaliacao_${evaluationData.child.name.replace(/\s+/g, '_')}.pdf`);
      
      toast({
        title: "Sucesso",
        description: "Relatório baixado com sucesso!"
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o relatório. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div id="pdf-content" className="bg-white p-8 rounded-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">RESULTADO DA AVALIAÇÃO</h1>
            <p className="text-lg text-gray-600">Idade de comunicação calculada</p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-green-600">Informações da Avaliação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <p className="text-lg">
                    <strong>Nome da criança:</strong> {evaluationData.child.name}
                  </p>
                  <p className="text-lg">
                    <strong>Idade cronológica da criança:</strong> {chronologicalAge}
                  </p>
                  <div className="bg-green-100 p-4 rounded-lg">
                    <p className="text-xl font-bold text-green-600">
                      <strong>Idade de comunicação:</strong> {evaluationData.communicationAge}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    <strong>Avaliação realizada em:</strong> {evaluationData.dataHoraPreenchimento}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-green-600">Gráfico de Desempenho</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`chart-container ${isMobile ? 'w-full' : 'w-full h-[550px]'} cursor-zoom-in`}
                  role="button"
                  aria-label="Ampliar gráfico"
                  onClick={() => setIsChartOpen(true)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsChartOpen(true); } }}
                  tabIndex={0}
                >
                  {isMobile ? (
                    <div className="w-[90%] mx-auto">
                      <AspectRatio ratio={16/12}>
                        <div className="h-full w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{
                              top: 20,
                              right: 20,
                              left: 40,
                              bottom: 95
                            }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis 
                                dataKey="name" 
                                tick={{ fontSize: 10 }}
                                axisLine={true}
                              />
                              <YAxis 
                                tick={{ fontSize: 10 }}
                                axisLine={true}
                              />
                              <Tooltip />
                              <Legend 
                                verticalAlign="bottom" 
                                height={40}
                                align="center"
                                iconType="rect"
                                wrapperStyle={{
                                  paddingTop: "10px",
                                  fontSize: "12px"
                                }}
                              />
                              <Bar dataKey="desired" fill="#10b981" name="Desejado">
                                <LabelList dataKey="desired" position="top" />
                              </Bar>
                              <Bar dataKey="minimum" fill="#ef4444" name="Mínimo">
                                <LabelList dataKey="minimum" position="top" />
                              </Bar>
                              <Bar dataKey="achieved" fill="#fb923c" name="Alcançado">
                                <LabelList dataKey="achieved" position="top" />
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </AspectRatio>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{
                        top: 30,
                        right: 30,
                        left: 40,
                        bottom: 70
                      }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 12 }}
                          axisLine={true}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          axisLine={true}
                        />
                        <Tooltip />
                        <Legend 
                          verticalAlign="bottom" 
                          height={50}
                          align="center"
                          iconType="rect"
                          wrapperStyle={{
                            paddingTop: "10px",
                            fontSize: "14px"
                          }}
                        />
                        <Bar dataKey="desired" fill="#10b981" name="Desejado">
                          <LabelList dataKey="desired" position="top" />
                        </Bar>
                        <Bar dataKey="minimum" fill="#ef4444" name="Mínimo">
                          <LabelList dataKey="minimum" position="top" />
                        </Bar>
                        <Bar dataKey="achieved" fill="#fb923c" name="Alcançado">
                          <LabelList dataKey="achieved" position="top" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <p className="md:hidden text-center text-xs text-gray-500 mt-2">Toque no gráfico para ampliar</p>
              </CardContent>
            </Card>

            <Dialog open={isChartOpen} onOpenChange={setIsChartOpen}>
              <DialogContent className="max-w-[95vw] sm:max-w-[900px]">
                <DialogHeader>
                  <DialogTitle>Gráfico ampliado</DialogTitle>
                  <DialogDescription>Visualização em tamanho maior do desempenho.</DialogDescription>
                </DialogHeader>
                <div className="w-[95vw] sm:w-[860px] h-[70vh] mx-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 30, right: 30, left: 40, bottom: 70 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={true} />
                      <YAxis tick={{ fontSize: 12 }} axisLine={true} />
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={50} align="center" iconType="rect" wrapperStyle={{ paddingTop: '10px', fontSize: '14px' }} />
                      <Bar dataKey="desired" fill="#10b981" name="Desejado">
                        <LabelList dataKey="desired" position="top" />
                      </Bar>
                      <Bar dataKey="minimum" fill="#ef4444" name="Mínimo">
                        <LabelList dataKey="minimum" position="top" />
                      </Bar>
                      <Bar dataKey="achieved" fill="#fb923c" name="Alcançado">
                        <LabelList dataKey="achieved" position="top" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </DialogContent>
            </Dialog>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">Como interpretar o resultado no gráfico</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <p><strong>Barras Verdes (Desejado):</strong> Representa o número ideal de habilidades que a criança deveria ter desenvolvido para cada faixa etária. É a meta de desenvolvimento esperada.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <p><strong>Barras Vermelhas (Mínimo):</strong> Representa o número mínimo de habilidades necessárias para um desenvolvimento adequado. Valores abaixo deste indicam necessidade de atenção especial.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <p><strong>Barras Laranjas (Alcançado):</strong> Representa quantas habilidades a criança já desenvolveu em cada faixa etária, baseado na avaliação realizada.</p>
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Dica de interpretação:</strong> Compare as barras laranjas (alcançado) com as verdes (desejado) e vermelhas (mínimo). 
                      Se a barra laranja estiver próxima ou acima da verde, o desenvolvimento está adequado. 
                      Se estiver abaixo da vermelha, pode indicar necessidade de estimulação adicional naquela área.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-xl text-orange-600 flex items-center gap-2">
                  ⚠️ ORIENTAÇÕES IMPORTANTES – Próximo passo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-orange-100 rounded-lg">
                  <p className="text-orange-800 leading-relaxed">
                    De posse do resultado da idade real de comunicação do seu filho, você deve procurar dentro do curso o Módulo <strong>"O QUE ENSINAR? (usar idade de comunicação do Mapa)"</strong> e colocar em prática todo o conteúdo disponível. Caso tenha alguma dúvida, fale com nossa Equipe de Suporte.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Button onClick={onRestart} className="bg-blue-600 hover:bg-blue-700">
            Refazer Avaliação
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-600 hover:bg-orange-700">
                Baixar Relatório
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Baixar Relatório</DialogTitle>
                <DialogDescription>
                  Deseja fazer o download deste relatório para o seu dispositivo?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleDownloadPDF} className="bg-orange-600 hover:bg-orange-700">
                  Confirmar Download
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button onClick={onFinish} className="bg-green-600 hover:bg-green-700">
            Finalizar Avaliação
          </Button>
        </div>

        <div className="flex justify-center mt-8">
          <Button variant="outline" onClick={onBackToInstructions} className="w-full md:w-auto">
            Voltar ao Início
          </Button>
        </div>
      </div>
    </div>
  );
};
