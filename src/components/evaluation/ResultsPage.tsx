import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EvaluationData } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { toast } from '@/hooks/use-toast';
import { calculateAge } from '@/utils/ageCalculator';
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
      const element = document.getElementById('pdf-content');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Relatorio_Avaliacao_${evaluationData.child.name.replace(/\s+/g, '_')}.pdf`);
      
      toast({
        title: "Sucesso",
        description: "Relatório baixado com sucesso!"
      });
      
      // Fechar o dialog automaticamente após sucesso
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
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{
                      top: 30,
                      right: 30,
                      left: 20,
                      bottom: 5
                    }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
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
              </CardContent>
            </Card>

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
