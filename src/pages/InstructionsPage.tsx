import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
interface InstructionsPageProps {
  onContinue: () => void;
}
export const InstructionsPage: React.FC<InstructionsPageProps> = ({
  onContinue
}) => {
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">MAPA DE PARTIDA</h1>
          <p className="text-lg text-gray-600 font-medium">Descubra a Real Idade de Comunicação do seu filho</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-center text-green-600">Instruções de preenchimento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Leia com atenção</h3>
                  <p className="text-gray-600">O MAPA DE PARTIDA é uma ferramenta que se baseia nas habilidades que uma criança deve apresentar em cada faixa etária, seguindo os marcos do desenvolvimento e da fala propostos por ampla literatura científica, no Manual do Inventário Portage Operacionalizado e Check List Denver, em Intervenção Precoce em Crianças com Autismo.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Seja realista</h3>
                  <p className="text-gray-600">Não marque habilidades que a criança fez apenas uma ou duas vezes. A avaliação deve refletir o comportamento habitual da criança. Marque APENAS as habilidades que a criança consegue fazer de forma consistente. Ou seja, se ela SEMPRE FAZ, MARQUE, se ela SÓ FAZ DE VEZ EM QUANDO, NÃO MARQUE.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">O que preencher</h3>
                  <p className="text-gray-600">Independente da idade do seu filho(a) você deve analisar TODAS as habilidades (de zero até 5 anos) e marcar aquelas habilidades que ele(a) já adquiriu e faz corriqueiramente.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Tempo necessário</h3>
                  <p className="text-gray-600">A avaliação leva aproximadamente 10-15 minutos. Reserve um tempo tranquilo para preenchê-la com cuidado, pois é muito importante que as informações reflitam a realidade da sua criança. O resultado do teste está diretamente relacionado à veracidade das informações.</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-800 mb-2">⚠️ Importante</h4>
              <div className="text-orange-700 text-sm font-normal space-y-2">
                <p>Esta avaliação é uma ferramenta de triagem e não substitui uma avaliação completa por um profissional fonoaudiólogo.</p>
                <p>Em caso de dúvidas sobre o preenchimento, consulte nossa Equipe de Suporte: (42)999004159/(42)999189030.</p>
                <p>Esta ferramenta é parte integrante do PROGRAMA FILHO QUE FALA, elaborado pela Dra. Camila Koszka, fonoaudióloga especializada, com mais de 18 anos de experiência, onde as MAMÃES APRENDEM A DESTRAVAR A FALA DOS SEUS FILHOS EM APENAS 30 DIAS!</p>
                <p>Todas as informações constantes neste teste seguem a Lei 12.965 de 2014 - Marco Civil da Internet e Lei 13.709 de 2018 - Lei Geral de Proteção de Dados (LGPD).</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button onClick={onContinue} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg" size="lg">
            Começar Avaliação
          </Button>
        </div>
      </div>
    </div>;
};