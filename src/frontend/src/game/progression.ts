export interface ProgressionState {
    collectionSets: {
        flowers: number;
        sparkles: number;
        qudoBoosts: number;
    };
    dailyStreak: number;
    lastPlayDate: string | null;
    quests: Quest[];
    level: number;
    experience: number;
}

export interface Quest {
    id: string;
    title: string;
    description: string;
    progress: number;
    target: number;
    reward: number;
    completed: boolean;
}

const DAILY_QUESTS: Omit<Quest, 'progress' | 'completed'>[] = [
    {
        id: 'collect_flowers',
        title: 'Flower Collector',
        description: 'Collect 20 flowers',
        target: 20,
        reward: 100,
    },
    {
        id: 'collect_sparkles',
        title: 'Sparkle Hunter',
        description: 'Collect 30 sparkles',
        target: 30,
        reward: 150,
    },
    {
        id: 'play_sessions',
        title: 'Sky Explorer',
        description: 'Complete 3 sessions',
        target: 3,
        reward: 200,
    },
];

export function initializeProgression(): ProgressionState {
    const stored = localStorage.getItem('progression');
    if (stored) {
        return JSON.parse(stored);
    }

    return {
        collectionSets: {
            flowers: 0,
            sparkles: 0,
            qudoBoosts: 0,
        },
        dailyStreak: 0,
        lastPlayDate: null,
        quests: DAILY_QUESTS.map((q) => ({ ...q, progress: 0, completed: false })),
        level: 1,
        experience: 0,
    };
}

export function updateProgression(
    state: ProgressionState,
    sessionSummary: any
): ProgressionState {
    const newState = { ...state };

    // Update collection sets
    newState.collectionSets.flowers += sessionSummary.flowersCollected;
    newState.collectionSets.sparkles += sessionSummary.sparklesCollected;
    if (sessionSummary.qudoBoostCollected) {
        newState.collectionSets.qudoBoosts += 1;
    }

    // Update daily streak
    const today = new Date().toDateString();
    if (newState.lastPlayDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (newState.lastPlayDate === yesterday.toDateString()) {
            newState.dailyStreak += 1;
        } else {
            newState.dailyStreak = 1;
        }
        newState.lastPlayDate = today;
    }

    // Update quests
    newState.quests = newState.quests.map((quest) => {
        if (quest.completed) return quest;

        let progress = quest.progress;
        if (quest.id === 'collect_flowers') {
            progress += sessionSummary.flowersCollected;
        } else if (quest.id === 'collect_sparkles') {
            progress += sessionSummary.sparklesCollected;
        } else if (quest.id === 'play_sessions') {
            progress += 1;
        }

        const completed = progress >= quest.target;
        return { ...quest, progress, completed };
    });

    // Update experience and level
    newState.experience += sessionSummary.totalReward;
    const expForNextLevel = newState.level * 1000;
    if (newState.experience >= expForNextLevel) {
        newState.level += 1;
        newState.experience -= expForNextLevel;
    }

    // Save to localStorage
    localStorage.setItem('progression', JSON.stringify(newState));

    return newState;
}

export function getProgressionStats(state: ProgressionState) {
    return {
        totalFlowers: state.collectionSets.flowers,
        totalSparkles: state.collectionSets.sparkles,
        totalQudoBoosts: state.collectionSets.qudoBoosts,
        dailyStreak: state.dailyStreak,
        level: state.level,
        experience: state.experience,
        expForNextLevel: state.level * 1000,
        completedQuests: state.quests.filter((q) => q.completed).length,
        totalQuests: state.quests.length,
    };
}
