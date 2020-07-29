import * as microsoftTeams from '@microsoft/teams-js';
import { useState, useEffect } from 'react';
import { themes } from '@fluentui/react-northstar';
import { useTeamsContext } from './useThemeContext';

export const useTeamsTheme = () => {
  const [theme, setTheme] = useState(themes.teams);
  const [context] = useTeamsContext();

  // Initialize the Microsoft Teams SDK
  microsoftTeams.initialize();

  const currentTheme = context?.theme;

  // Check the initial theme user chose and respect it
  useEffect(() => {
    if (currentTheme) {
      setTheme(getTheme(currentTheme));
    }
  }, [currentTheme]);

  // Handle theme changes
  microsoftTeams.registerOnThemeChangeHandler(function (theme) {
    setTheme(getTheme(theme));
  });

  return { theme, setTheme };
};

const getTheme = (theme: string) => {
  if (theme === 'dark') {
    return themes.teamsDark;
  } else if (theme === 'contrast') {
    return themes.teamsHighContrast;
  } else {
    return themes.teams;
  }
};
