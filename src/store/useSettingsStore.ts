import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  openAiKey: string;
  setOpenAiKey: (key: string) => void;
  openAiBaseUrl: string;
  setOpenAiBaseUrl: (url: string) => void;
  anthropicKey: string;
  setAnthropicKey: (key: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      openAiKey: 'sk-************************************',
      setOpenAiKey: (key) => set({ openAiKey: key }),
      openAiBaseUrl: 'https://api.openai.com/v1',
      setOpenAiBaseUrl: (url) => set({ openAiBaseUrl: url }),
      anthropicKey: '',
      setAnthropicKey: (key) => set({ anthropicKey: key }),
    }),
    {
      name: 'pubagent-settings',
    }
  )
);
