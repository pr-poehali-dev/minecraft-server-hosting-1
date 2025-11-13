import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Toaster } from '@/components/ui/toaster';
import Icon from '@/components/ui/icon';
import AuthDialog from '@/components/AuthDialog';

const PLANS_URL = 'https://functions.poehali.dev/2fb9cc65-172d-4f1b-8afb-2d8771993279';

interface Plan {
  id: number;
  name: string;
  slug: string;
  price: string;
  max_players: number;
  ram_gb: number;
  cpu_cores: number;
  storage_gb: number;
  has_ddos_protection: boolean;
  support_level: string;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
}

interface User {
  id: number;
  email: string;
  full_name: string;
}

export default function Index() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch(PLANS_URL);
      const data = await response.json();
      if (data.success) {
        setPlans(data.plans);
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setPlansLoading(false);
    }
  };

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };



  const faqs = [
    {
      question: 'Как быстро активируется сервер?',
      answer: 'Ваш сервер будет готов к работе в течение 5 минут после оплаты. Вы сразу получите доступ к панели управления.'
    },
    {
      question: 'Что входит в защиту от DDoS?',
      answer: 'Мы используем многоуровневую защиту от DDoS-атак, включая фильтрацию трафика и автоматическое обнаружение угроз. Ваш сервер останется доступным даже при атаках.'
    },
    {
      question: 'Можно ли сменить тариф?',
      answer: 'Да, вы можете в любой момент повысить или понизить тариф. При повышении разница будет пересчитана пропорционально.'
    },
    {
      question: 'Какие версии Minecraft поддерживаются?',
      answer: 'Мы поддерживаем все версии Minecraft от 1.8 до последней актуальной версии, включая Paper, Spigot, Forge и другие сборки.'
    }
  ];

  return (
    <div className="min-h-screen bg-background font-roboto">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-montserrat font-bold text-xl">
              C
            </div>
            <span className="font-montserrat font-bold text-2xl text-foreground">CargoHost</span>
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#home" className="text-foreground hover:text-primary transition-colors font-medium">Главная</a>
            <a href="#pricing" className="text-foreground hover:text-primary transition-colors font-medium">Тарифы</a>
            <a href="#support" className="text-foreground hover:text-primary transition-colors font-medium">Поддержка</a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium">О нас</a>
          </div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden md:block">{user.email}</span>
              <Button variant="outline" onClick={handleLogout}>Выйти</Button>
            </div>
          ) : (
            <Button onClick={() => setAuthOpen(true)}>Войти</Button>
          )}
        </div>
      </nav>

      <section id="home" className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="font-montserrat font-bold text-5xl md:text-7xl text-foreground mb-6">
              Хостинг для<br />
              <span className="text-primary">Minecraft серверов</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Стабильная работа с защитой от DDoS-атак. Запустите свой сервер за 5 минут
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                Начать сейчас
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Узнать больше
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-20 animate-scale-in">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Shield" className="text-primary" size={24} />
                </div>
                <CardTitle className="font-montserrat">DDoS защита</CardTitle>
                <CardDescription>
                  Многоуровневая защита от атак для бесперебойной работы
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Zap" className="text-primary" size={24} />
                </div>
                <CardTitle className="font-montserrat">Быстрый запуск</CardTitle>
                <CardDescription>
                  Сервер готов к работе за 5 минут после оплаты
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Headphones" className="text-primary" size={24} />
                </div>
                <CardTitle className="font-montserrat">Поддержка 24/7</CardTitle>
                <CardDescription>
                  Наша команда всегда готова помочь вам
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-montserrat font-bold text-4xl md:text-5xl text-foreground mb-4">
              Выберите свой <span className="text-primary">тариф</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Все тарифы включают защиту от DDoS и круглосуточную поддержку
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plansLoading ? (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground">Загрузка тарифов...</p>
              </div>
            ) : plans.length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground">Нет доступных тарифов</p>
              </div>
            ) : (
              plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative transition-all hover:scale-105 cursor-pointer ${
                  plan.is_popular ? 'border-primary border-2 shadow-lg' : 'border-2'
                } ${selectedPlan === plan.slug ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setSelectedPlan(plan.slug)}
              >
                {plan.is_popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-montserrat font-semibold">
                    Популярный
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="font-montserrat text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="font-montserrat font-bold text-4xl text-primary">{plan.price}₽</span>
                    <span className="text-muted-foreground">/мес</span>
                  </div>
                  <CardDescription className="text-lg font-semibold text-foreground">
                    До {plan.max_players} игроков
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Icon name="Check" className="text-primary" size={20} />
                      <span>{plan.ram_gb} GB RAM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Check" className="text-primary" size={20} />
                      <span>{plan.cpu_cores} vCPU</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Check" className="text-primary" size={20} />
                      <span>{plan.storage_gb} GB SSD</span>
                    </div>
                    {plan.has_ddos_protection && (
                      <div className="flex items-center gap-2">
                        <Icon name="Shield" className="text-primary" size={20} />
                        <span className="font-semibold">DDoS защита</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Icon name="Clock" className="text-primary" size={20} />
                      <span>Поддержка {plan.support_level}</span>
                    </div>
                    {plan.features && plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Icon name="Check" className="text-primary" size={20} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-6" variant={plan.is_popular ? 'default' : 'outline'}>
                    Выбрать тариф
                  </Button>
                </CardContent>
              </Card>
            ))
            )}
          </div>
        </div>
      </section>

      <section id="support" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-montserrat font-bold text-4xl md:text-5xl text-foreground mb-4">
              Часто задаваемые <span className="text-primary">вопросы</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Ответы на популярные вопросы о нашем хостинге
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border-2 rounded-lg px-6">
                <AccordionTrigger className="font-montserrat font-semibold text-left hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="font-montserrat text-2xl">Не нашли ответ?</CardTitle>
                <CardDescription className="text-base">
                  Наша служба поддержки работает круглосуточно и готова помочь вам
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center gap-6">
                  <Button variant="outline" className="gap-2">
                    <Icon name="Mail" size={20} />
                    Email
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Icon name="MessageCircle" size={20} />
                    Discord
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Icon name="Send" size={20} />
                    Telegram
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-montserrat font-bold text-4xl md:text-5xl text-foreground mb-6">
            О <span className="text-primary">CargoHost</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Мы команда энтузиастов Minecraft, которая создала надежный хостинг для игровых серверов. 
            Наша миссия — предоставить стабильную и безопасную платформу для вашего сообщества.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="font-montserrat font-bold text-4xl text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground">Аптайм серверов</div>
            </div>
            <div className="text-center">
              <div className="font-montserrat font-bold text-4xl text-primary mb-2">5000+</div>
              <div className="text-muted-foreground">Активных серверов</div>
            </div>
            <div className="text-center">
              <div className="font-montserrat font-bold text-4xl text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Техподдержка</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-foreground text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-montserrat font-bold text-xl">
                  C
                </div>
                <span className="font-montserrat font-bold text-xl">CargoHost</span>
              </div>
              <p className="text-white/70">
                Надежный хостинг для ваших Minecraft серверов
              </p>
            </div>
            <div>
              <h3 className="font-montserrat font-semibold mb-4">Навигация</h3>
              <div className="space-y-2">
                <a href="#home" className="block text-white/70 hover:text-white transition-colors">Главная</a>
                <a href="#pricing" className="block text-white/70 hover:text-white transition-colors">Тарифы</a>
                <a href="#support" className="block text-white/70 hover:text-white transition-colors">Поддержка</a>
                <a href="#about" className="block text-white/70 hover:text-white transition-colors">О нас</a>
              </div>
            </div>
            <div>
              <h3 className="font-montserrat font-semibold mb-4">Контакты</h3>
              <div className="space-y-2 text-white/70">
                <div>support@cargohost.ru</div>
                <div>+7 (800) 555-35-35</div>
              </div>
            </div>
            <div>
              <h3 className="font-montserrat font-semibold mb-4">Мы в соцсетях</h3>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="text-white hover:text-primary">
                  <Icon name="Send" size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:text-primary">
                  <Icon name="MessageCircle" size={20} />
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/70">
            <p>© 2024 CargoHost. Все права защищены.</p>
          </div>
        </div>
      </footer>

      <AuthDialog 
        open={authOpen} 
        onOpenChange={setAuthOpen} 
        onAuthSuccess={handleAuthSuccess}
      />
      <Toaster />
    </div>
  );
}