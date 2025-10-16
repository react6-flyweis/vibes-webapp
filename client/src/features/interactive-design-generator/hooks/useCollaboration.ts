import { useState, useCallback } from "react";
import { Collaborator } from "../types";
import { createSparkleEffect } from "../utils/color-utils";

export function useCollaboration() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  const addCollaborator = useCallback((collaborator: Collaborator) => {
    setCollaborators((prev) => [...prev, collaborator]);

    // Add sparkle effect for collaboration
    const sparkles = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));

    sparkles.forEach((sparkle, index) => {
      setTimeout(() => {
        const element = document.createElement("div");
        element.className =
          "fixed pointer-events-none z-50 w-3 h-3 bg-blue-400 rounded-full animate-bounce";
        element.style.left = `${sparkle.x}%`;
        element.style.top = `${sparkle.y}%`;
        document.body.appendChild(element);

        setTimeout(() => {
          if (document.body.contains(element)) {
            document.body.removeChild(element);
          }
        }, 2000);
      }, index * 200);
    });
  }, []);

  const removeCollaborator = useCallback((collaboratorId: number) => {
    setCollaborators((prev) => prev.filter((c) => c.id !== collaboratorId));
  }, []);

  const triggerSparkleEffect = useCallback(() => {
    createSparkleEffect("collaboration", 10);
  }, []);

  return {
    collaborators,
    addCollaborator,
    removeCollaborator,
    triggerSparkleEffect,
  };
}
