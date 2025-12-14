import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Brain, Target, Shield, Eye, Zap, MessageCircle } from "lucide-react";

const Mental = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-16">
          <h1 className="font-bebas text-5xl md:text-7xl text-primary mb-4">
            {t("services.mental.title", "MENTAL SKILLS")}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl italic mb-6">
            Football is not solely about skill; the fine margins are decided by will.
          </p>
          <div className="flex flex-wrap gap-4 text-lg text-primary font-medium">
            <span>Consistency</span>
            <span className="text-muted-foreground">•</span>
            <span>Focus</span>
            <span className="text-muted-foreground">•</span>
            <span>Resilience</span>
            <span className="text-muted-foreground">•</span>
            <span>Confidence</span>
          </div>
        </section>

        {/* Overview Section */}
        <section className="container mx-auto px-4 mb-16">
          <h2 className="font-bebas text-4xl text-primary mb-6">Overview</h2>
          <div className="space-y-6 text-muted-foreground max-w-4xl">
            <p className="text-lg leading-relaxed">
              It is the combination of skill and will which decides every victor. It does not matter how great a player you are if you suffer mental defeat to an opponent. Mastering your mind and possessing mental strength plays a pivotal role in Football. Our bespoke psychological support services aim to fortify your mind, empowering you to take on increasingly great challenges, manage pressure, and perform consistently at your highest level.
            </p>
            <p className="text-lg leading-relaxed">
              Whether you are battling performance anxiety, seeking to boost your mental resilience, or striving to enhance your concentration during high-stakes moments, our tailored and individualised 1:1 training will help you secure the mental edge over your competition. With Fuel for Football, you win the game with your mind, to in turn win on the pitch.
            </p>
            <p className="text-lg leading-relaxed">
              Mental skills are the foundation upon which all other abilities depend. Consistency on the pitch requires strong mental skills, a fact recognised by Sir Alex Ferguson as key to prolonged elite performance. Our Mental Skill Training focuses on developing consistency, confidence, resilience, and focus, all while maintaining complete confidentiality, most importantly including from your club's personnel.
            </p>
            <p className="text-lg leading-relaxed">
              We start by testing your mental skill level and comparing it to other elite athletes we have trained. Based on this assessment, we create bespoke individualised sessions tailored to your needs. These one-to-one sessions can be conducted in person or over the phone, ensuring you receive the personalised support necessary to strengthen your mental game.
            </p>
          </div>
        </section>

        {/* Mental Will Section */}
        <section className="container mx-auto px-4 mb-16">
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="font-bebas text-3xl text-primary mb-4">Mental Will</h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-4xl">
              The difference between players of similar ability often lies in their mental will. With greater will than an opponent, it is possible to outperform them even with less skill. Mental will is developed like any muscle in the gym, through training. Mental will speaks to drive and determination. If you want something more than an opponent, it is often enough to overcome any skill deficit. This service is perfect for booking in before games to prepare the mind for action and to have the greatest performance possible.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="container mx-auto px-4 mb-16">
          <h2 className="font-bebas text-4xl text-primary mb-8">Our Services</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Performance */}
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-8 w-8 text-primary" />
                <h3 className="font-bebas text-2xl text-primary">Performance</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">(Mental Will Training)</p>
              <p className="text-muted-foreground leading-relaxed">
                Our psychological performance sessions provide tailored support by providing players with Mental Will training and Mindset Conditioning. Through performance reviews, players receive the support they need from game to game to develop their mental strength and increase consistency within their performance on and off the pitch.
              </p>
            </div>

            {/* Development */}
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="h-8 w-8 text-primary" />
                <h3 className="font-bebas text-2xl text-primary">Development</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">(Mental Skill Training)</p>
              <p className="text-muted-foreground leading-relaxed">
                Psychological development is crucial for success. Mental skills sessions will help you improve your long-term psychological performance. By focusing on mental skills such as visualisation, goal-setting, and self-talk, you will develop the mental toughness and resilience needed to succeed at the highest level.
              </p>
            </div>
          </div>
        </section>

        {/* Key Mental Skills */}
        <section className="container mx-auto px-4 mb-16">
          <h2 className="font-bebas text-4xl text-primary mb-8">Key Mental Skills</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <Target className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-bebas text-xl text-primary mb-2">Consistency</h3>
              <p className="text-sm text-muted-foreground">Perform at your best, every match</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <Eye className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-bebas text-xl text-primary mb-2">Focus</h3>
              <p className="text-sm text-muted-foreground">Maintain concentration in high-pressure moments</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-bebas text-xl text-primary mb-2">Resilience</h3>
              <p className="text-sm text-muted-foreground">Bounce back stronger from setbacks</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <MessageCircle className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-bebas text-xl text-primary mb-2">Confidence</h3>
              <p className="text-sm text-muted-foreground">Believe in your abilities under any circumstance</p>
            </div>
          </div>
        </section>

        {/* Confidentiality Note */}
        <section className="container mx-auto px-4">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
            <h3 className="font-bebas text-2xl text-primary mb-4">Complete Confidentiality</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              All sessions are conducted with complete confidentiality, including from your club's personnel. Your mental development journey remains private, allowing you to work on your mindset without external pressures.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Mental;
