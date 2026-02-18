import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Palette, Lightbulb, Sparkles, Instagram, Twitter, Facebook, Linkedin, Hash, MessageSquare, ExternalLink, Inbox, FileText, Image, Archive } from "lucide-react";
import { IdeasReview } from "./IdeasReview";
import { BTLWriter } from "./BTLWriter";
import { ImageCreator } from "./ImageCreator";
import { PostContent } from "./PostContent";

export const ContentCreator = () => {
  return (
    <Tabs defaultValue="ideas" className="w-full">
      <TabsList className="mb-6 flex-wrap h-auto gap-1 w-full justify-start md:justify-start">
        <TabsTrigger value="ideas" className="text-xs sm:text-sm px-2 sm:px-3">
          <Inbox className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          <span className="hidden sm:inline">Review</span> Ideas
        </TabsTrigger>
        <TabsTrigger value="btl-writer" className="text-xs sm:text-sm px-2 sm:px-3">
          <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          BTL
        </TabsTrigger>
        <TabsTrigger value="image-creator" className="text-xs sm:text-sm px-2 sm:px-3">
          <Image className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Image
        </TabsTrigger>
        <TabsTrigger value="post-schedule" className="text-xs sm:text-sm px-2 sm:px-3">
          <Archive className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Schedule
        </TabsTrigger>
        <TabsTrigger value="tools" className="text-xs sm:text-sm px-2 sm:px-3">Tools</TabsTrigger>
      </TabsList>

      <TabsContent value="ideas">
        <IdeasReview />
      </TabsContent>

      <TabsContent value="btl-writer">
        <BTLWriter />
      </TabsContent>

      <TabsContent value="image-creator">
        <ImageCreator />
      </TabsContent>

      <TabsContent value="post-schedule">
        <PostContent />
      </TabsContent>

      <TabsContent value="tools">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-500" />
                Design Tools
              </CardTitle>
              <CardDescription>Create stunning visuals for social media</CardDescription>
            </CardHeader>
            <CardContent>
              <a href="https://www.canva.com/design/DAG0N9vOwtg/6ZmTuSDkJzR9_b0nl7czJA/edit" target="_blank" rel="noopener noreferrer" className="block">
                <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:border-purple-500/50 transition-all hover:shadow-lg cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-purple-500/20">
                          <Sparkles className="w-8 h-8 text-purple-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Open Canva Design Studio</h3>
                          <p className="text-sm text-muted-foreground">Access all templates, brand assets, and create new designs</p>
                        </div>
                      </div>
                      <ExternalLink className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-accent" />
                Post Ideas
              </CardTitle>
              <CardDescription>Content inspiration for different platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="player-content">
                  <AccordionTrigger className="text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-blue-500" />
                      Player Content Ideas
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-sm text-muted-foreground pl-6">
                      <li>• Match day countdown with player focus</li>
                      <li>• Training session highlights & behind the scenes</li>
                      <li>• Player stats infographic after key performances</li>
                      <li>• Goal/assist compilation reels</li>
                      <li>• Transfer announcement graphics</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="brand-content">
                  <AccordionTrigger className="text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      Brand Building Ideas
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-sm text-muted-foreground pl-6">
                      <li>• Success story testimonials</li>
                      <li>• Industry news & insights commentary</li>
                      <li>• Partnership announcements</li>
                      <li>• Client spotlight series</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="engagement">
                  <AccordionTrigger className="text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-green-500" />
                      Engagement Drivers
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-sm text-muted-foreground pl-6">
                      <li>• Polls & quizzes about football</li>
                      <li>• Throwback Thursday / Flashback Friday</li>
                      <li>• Prediction competitions for match outcomes</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="w-5 h-5 text-blue-500" />
                Platform Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-pink-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Instagram className="w-5 h-5 text-pink-500" />
                      <h4 className="font-semibold">Instagram</h4>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Best times: 11am-1pm, 7-9pm</li>
                      <li>• Reels for maximum reach</li>
                      <li>• Carousel for detailed content</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="border-blue-400/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Twitter className="w-5 h-5 text-blue-400" />
                      <h4 className="font-semibold">X (Twitter)</h4>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Best times: 8-10am, 12-1pm</li>
                      <li>• Keep tweets under 280 chars</li>
                      <li>• Engage with trending topics</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="border-blue-600/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Facebook className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold">Facebook</h4>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Video gets priority in feed</li>
                      <li>• Create events for matches</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="border-blue-700/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Linkedin className="w-5 h-5 text-blue-700" />
                      <h4 className="font-semibold">LinkedIn</h4>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Professional tone</li>
                      <li>• Industry insights & analysis</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-accent" />
                Weekly Content Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2">
                {[
                  { day: 'Mon', theme: 'Motivation Monday', icon: '💪', desc: 'Player quotes, training clips' },
                  { day: 'Tue', theme: 'Tactical Tuesday', icon: '📊', desc: 'Stats, analysis, insights' },
                  { day: 'Wed', theme: 'Wellness Wed', icon: '🏃', desc: 'Training, fitness, health' },
                  { day: 'Thu', theme: 'Throwback', icon: '📸', desc: 'Historic moments, memories' },
                  { day: 'Fri', theme: 'Match Preview', icon: '⚽', desc: 'Weekend fixture build-up' },
                  { day: 'Sat', theme: 'Matchday', icon: '🔥', desc: 'Live updates, reactions' },
                  { day: 'Sun', theme: 'Review', icon: '📝', desc: 'Results, highlights, recap' },
                ].map((item) => (
                  <Card key={item.day} className="bg-muted/50">
                    <CardContent className="p-3 text-center">
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <div className="font-semibold text-xs">{item.day}</div>
                      <div className="text-[10px] text-accent font-medium">{item.theme}</div>
                      <div className="text-[9px] text-muted-foreground mt-1">{item.desc}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};
