import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  MessageCircle,
  Users,
  Send,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

export default function LessonRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoOn, setVideoOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");

  const chatMessages = [
    { sender: "Dr. Martin", text: "Bonjour ! Prêt pour le cours ?", time: "14:00" },
    { sender: "Vous", text: "Oui, allons-y !", time: "14:01" },
  ];

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4 animate-fade-in">
      {/* Zone vidéo principale */}
      <div className="flex flex-1 flex-col gap-4">
        <div className="relative flex-1 overflow-hidden rounded-2xl bg-sidebar">
          {/* Placeholder vidéo */}
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-sidebar-foreground">
              <Video className="mx-auto mb-4 h-16 w-16 opacity-30" />
              <p className="text-lg font-medium">Salle de cours #{id}</p>
              <p className="text-sm opacity-60">
                La visioconférence sera intégrée dans la Phase 5
              </p>
            </div>
          </div>

          {/* Petite vidéo utilisateur */}
          <div className="absolute bottom-4 right-4 h-32 w-44 overflow-hidden rounded-xl bg-sidebar/80 backdrop-blur">
            <div className="flex h-full items-center justify-center">
              <Users className="h-8 w-8 text-sidebar-foreground/50" />
            </div>
          </div>

          {/* Nom du tuteur */}
          <div className="absolute left-4 top-4 rounded-lg bg-sidebar/80 px-3 py-1.5 text-sm font-medium text-sidebar-foreground backdrop-blur">
            Dr. Martin — Mathématiques
          </div>
        </div>

        {/* Contrôles */}
        <div className="flex items-center justify-center gap-3">
          <Button
            variant={micOn ? "outline" : "destructive"}
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={() => setMicOn(!micOn)}
          >
            {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>
          <Button
            variant={videoOn ? "outline" : "destructive"}
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={() => setVideoOn(!videoOn)}
          >
            {videoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
            <Monitor className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={() => setChatOpen(!chatOpen)}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={() => navigate("/lessons")}
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Chat latéral */}
      {chatOpen && (
        <Card className="glass-card flex w-80 flex-col">
          <div className="border-b p-3">
            <h3 className="text-sm font-semibold">Chat du cours</h3>
          </div>
          <div className="flex-1 space-y-3 overflow-auto p-3">
            {chatMessages.map((msg, i) => (
              <div key={i}>
                <p className="text-xs font-medium">{msg.sender} <span className="text-muted-foreground">{msg.time}</span></p>
                <p className="text-sm text-muted-foreground">{msg.text}</p>
              </div>
            ))}
          </div>
          <div className="border-t p-3">
            <form
              onSubmit={(e) => { e.preventDefault(); setChatInput(""); }}
              className="flex gap-2"
            >
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Message..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}
    </div>
  );
}
