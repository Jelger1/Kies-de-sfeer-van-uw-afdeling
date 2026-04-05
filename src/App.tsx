/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Headphones, Heart, User, Info, CheckCircle2, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ArtWork {
  id: number;
  title: string;
  artist: string;
  vision: string;
  content: string;
  fact: string;
  image: string;
  avatar: string;
  votes: number;
}

const ARTWORKS: ArtWork[] = [
  {
    id: 1,
    title: "Abstracte Reflectie",
    artist: "Marie Dubois",
    vision: "Ik streef naar rust door kleur en vorm in balans te brengen.",
    content: "Dit werk is een visuele meditatie over de balans tussen lichaam en geest. De gelaagde blauwtinten zijn zorgvuldig gekozen om de hartslag te verlagen en een gevoel van oneindige ruimte te creëren, precies wat nodig is tijdens een herstelperiode.",
    fact: "Dit werk doet verpleegkundige Chris denken aan zijn eerste vakantie aan de Franse kust.",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800",
    avatar: "https://i.pravatar.cc/150?u=marie",
    votes: 45
  },
  {
    id: 2,
    title: "Limburgs Heuvelland",
    artist: "Sven Jansen",
    vision: "De kracht van de natuur is de beste medicijn voor herstel.",
    content: "Een panoramische reis door het hart van onze eigen regio. Sven Jansen vangt het moment waarop de ochtendmist optrekt boven de Geulvallei. Het herinnert ons aan de veerkracht van de natuur en de frisse start die elke nieuwe dag biedt.",
    fact: "Patiënt mevrouw De Vries ziet hierin de heuvels van haar jeugd in Valkenburg.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
    avatar: "https://i.pravatar.cc/150?u=sven",
    votes: 32
  },
  {
    id: 3,
    title: "De Waakzame Ree",
    artist: "Aisha Patel",
    vision: "Veiligheid en verbinding zijn de fundamenten van zorg.",
    content: "In de stilte van het bos vinden we een moment van pure verbinding. Dit werk symboliseert de zorgzame blik die we voor elkaar hebben binnen Zuyderland. De zachte texturen en warme lichtinval creëren een veilige haven in de ziekenhuiskamer.",
    fact: "Dit hertje symboliseert de zachte kracht van onze nachtploeg op de afdeling.",
    image: "https://images.unsplash.com/photo-1508197149814-0cc02e8b7f74?auto=format&fit=crop&q=80&w=800",
    avatar: "https://i.pravatar.cc/150?u=aisha",
    votes: 23
  }
];

export default function App() {
  const [votedId, setVotedId] = useState<number | null>(null);
  const [listeningId, setListeningId] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [showFact, setShowFact] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (listeningId !== null) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setListeningId(null);
            return 100;
          }
          return prev + (100 / 30); // 30 seconds
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [listeningId]);

  const handleVote = (id: number) => {
    setVotedId(id);
  };

  const handleListen = (id: number) => {
    if (listeningId === id) {
      setListeningId(null);
    } else {
      setListeningId(id);
    }
  };

  const toggleFact = (id: number) => {
    setShowFact(showFact === id ? null : id);
  };

  return (
    <div className="min-h-screen flex flex-col font-calibri text-[14.66px]">
      {/* Header */}
      <header className="bg-white border-b border-zuyderland-lightblue/30 py-6 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-zuyderland-darkblue rounded-lg flex items-center justify-center text-white font-bold text-2xl">
              Z
            </div>
            <div className="border-l border-gray-300 pl-4">
              <h1 className="text-2xl font-bold text-zuyderland-darkblue leading-none">Zuyderland</h1>
              <p className="text-sm text-zuyderland-darkblue font-medium mt-1">De zorg van je leven</p>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-zuyderland-darkblue">
          <span className="bg-zuyderland-lightblue/20 px-4 py-2 rounded-full">Kunstpanel • Stemmen open tot 15 April</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-8 md:p-12">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-zuyderland-darkblue">Kies de sfeer van uw afdeling</h2>
          <p className="text-gray-600 leading-relaxed">
            Welk kunstwerk spreekt u het meeste aan? Uw stem helpt ons bij het creëren van een 
            <strong> Healing Environment</strong> die bijdraagt aan rust en herstel.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {ARTWORKS.map((work) => (
            <motion.div
              key={work.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-3xl overflow-hidden shadow-xl border-2 transition-all duration-500 flex flex-col ${
                votedId === work.id ? 'border-zuyderland-lightblue ring-4 ring-zuyderland-lightblue/10' : 'border-transparent hover:border-zuyderland-lightblue/30'
              }`}
            >
              {/* Artwork Image */}
              <div className="relative h-64 overflow-hidden group">
                <img
                  src={work.image}
                  alt={work.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-white text-sm font-medium flex items-center gap-2">
                    <Info size={16} /> Klik voor details
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Artist Profile */}
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={work.avatar}
                    alt={work.artist}
                    className="w-12 h-12 rounded-full border-2 border-zuyderland-lightblue"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{work.artist}</h3>
                    <p className="text-xs text-zuyderland-darkblue font-semibold uppercase tracking-wider">Kunstenaar</p>
                  </div>
                </div>

                <h4 className="text-xl font-bold mb-3 text-zuyderland-darkblue">{work.title}</h4>
                
                <p className="text-sm text-gray-500 italic mb-4 leading-relaxed">
                  "{work.vision}"
                </p>

                <div className="bg-zuyderland-lightblue/10 p-4 rounded-2xl mb-6 flex-1">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {work.content}
                  </p>
                </div>

                {/* Audio Player Mockup */}
                <div className="mb-6">
                  <button
                    onClick={() => handleListen(work.id)}
                    className={`w-full flex items-center justify-center gap-3 py-3 rounded-xl font-bold transition-all ${
                      listeningId === work.id 
                        ? 'bg-zuyderland-darkblue text-white' 
                        : 'bg-white border-2 border-zuyderland-darkblue text-zuyderland-darkblue hover:bg-zuyderland-lightblue/20'
                    }`}
                  >
                    <Headphones size={20} />
                    {listeningId === work.id ? 'Aan het luisteren...' : 'Beluister Visie'}
                  </button>
                  
                  <AnimatePresence>
                    {listeningId === work.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-3 overflow-hidden"
                      >
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-zuyderland-darkblue"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "linear" }}
                          />
                        </div>
                        <div className="flex justify-between mt-1 text-[10px] font-bold text-zuyderland-darkblue uppercase">
                          <span>0:00</span>
                          <span>0:30</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Wist je dat? */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleFact(work.id)}
                    className="flex items-center gap-2 text-sm font-bold text-zuyderland-darkblue hover:underline"
                  >
                    {showFact === work.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    Wist je dat?
                  </button>
                  <AnimatePresence>
                    {showFact === work.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-2 text-sm text-gray-600 bg-zuyderland-lightblue/5 p-3 rounded-xl border-l-4 border-zuyderland-lightblue"
                      >
                        {work.fact}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Vote Section */}
                <div className="mt-auto">
                  {votedId === work.id ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-zuyderland-lightblue/10 border border-zuyderland-lightblue/30 p-4 rounded-2xl"
                    >
                      <div className="flex items-center gap-2 text-zuyderland-darkblue font-bold mb-3">
                        <CheckCircle2 size={20} />
                        Bedankt voor je stem!
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-gray-500 uppercase">
                          <span>Huidige Stand</span>
                          <span>{work.votes}%</span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${work.votes}%` }}
                            className="h-full bg-zuyderland-darkblue"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <button
                      onClick={() => handleVote(work.id)}
                      disabled={votedId !== null}
                      className={`w-full py-4 rounded-2xl font-black text-lg uppercase tracking-widest transition-all shadow-lg hover:shadow-xl active:scale-95 ${
                        votedId !== null 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-zuyderland-darkblue text-white hover:bg-zuyderland-darkblue/90'
                      }`}
                    >
                      Stem Nu
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-zuyderland-lightblue/30 p-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 text-zuyderland-darkblue font-bold">
            <Heart size={24} className="fill-zuyderland-darkblue" />
            <span>De zorg van je leven</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-500 font-medium">
            <a href="#" className="hover:text-zuyderland-darkblue transition-colors">Privacybeleid</a>
            <a href="#" className="hover:text-zuyderland-darkblue transition-colors">Over Zuyderland</a>
            <a href="#" className="hover:text-zuyderland-darkblue transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
