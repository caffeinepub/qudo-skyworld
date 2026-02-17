export interface SessionState {
    phase: 'active' | 'ended';
    time: number;
    duration: number;
    cloudX: number;
    cloudY: number;
    flowers: Array<{ x: number; y: number; type: number; collected: boolean }>;
    sparkles: Array<{ x: number; y: number; opacity: number; frameIndex: number }>;
    qudoBoost: { x: number; y: number; active: boolean } | null;
    flowersCollected: number;
    sparklesCollected: number;
    qudoBoostCollected: boolean;
    interactions: number;
}

export function createSession(): SessionState {
    return {
        phase: 'active',
        time: 0,
        duration: 120, // 2 minutes
        cloudX: 400,
        cloudY: 300,
        flowers: [],
        sparkles: generateSparkles(20),
        qudoBoost: null,
        flowersCollected: 0,
        sparklesCollected: 0,
        qudoBoostCollected: false,
        interactions: 0,
    };
}

function generateSparkles(count: number) {
    return Array.from({ length: count }, () => ({
        x: Math.random() * 800,
        y: Math.random() * 600,
        opacity: 0.5 + Math.random() * 0.5,
        frameIndex: Math.floor(Math.random() * 16),
    }));
}

function spawnFlower(session: SessionState) {
    session.flowers.push({
        x: Math.random() * 800,
        y: -50,
        type: Math.floor(Math.random() * 16),
        collected: false,
    });
}

function spawnQudoBoost(session: SessionState) {
    if (!session.qudoBoost && Math.random() < 0.01) {
        session.qudoBoost = {
            x: Math.random() * 700 + 50,
            y: Math.random() * 500 + 50,
            active: true,
        };
    }
}

export function updateSession(
    session: SessionState,
    deltaTime: number,
    input: { mouseX: number; mouseY: number; isDown: boolean },
    theme: any
): SessionState {
    const newSession = { ...session };
    newSession.time += deltaTime;

    // Check if session should end
    if (newSession.time >= newSession.duration) {
        newSession.phase = 'ended';
        return newSession;
    }

    // Update cloud position (smooth follow)
    const dx = input.mouseX - newSession.cloudX;
    const dy = input.mouseY - newSession.cloudY;
    newSession.cloudX += dx * 0.1;
    newSession.cloudY += dy * 0.1;

    // Track interactions
    if (input.isDown) {
        newSession.interactions++;
    }

    // Spawn flowers periodically
    if (Math.random() < 0.02) {
        spawnFlower(newSession);
    }

    // Update flowers
    newSession.flowers = newSession.flowers
        .map((flower) => ({
            ...flower,
            y: flower.y + 50 * deltaTime,
        }))
        .filter((flower) => flower.y < 650);

    // Check flower collection
    newSession.flowers.forEach((flower) => {
        if (!flower.collected) {
            const dist = Math.hypot(flower.x - newSession.cloudX, flower.y - newSession.cloudY);
            if (dist < 50) {
                flower.collected = true;
                newSession.flowersCollected++;
            }
        }
    });

    // Spawn Qudo boost
    spawnQudoBoost(newSession);

    // Check Qudo boost collection
    if (newSession.qudoBoost && newSession.qudoBoost.active) {
        const dist = Math.hypot(
            newSession.qudoBoost.x - newSession.cloudX,
            newSession.qudoBoost.y - newSession.cloudY
        );
        if (dist < 60) {
            newSession.qudoBoost.active = false;
            newSession.qudoBoostCollected = true;
        }
    }

    return newSession;
}

export function endSession(session: SessionState) {
    const baseReward = session.flowersCollected * 10 + session.sparklesCollected * 5;
    const boostMultiplier = session.qudoBoostCollected ? 2 : 1;
    const interactionBonus = Math.min(session.interactions, 100);
    const totalReward = (baseReward + interactionBonus) * boostMultiplier;

    return {
        flowersCollected: session.flowersCollected,
        sparklesCollected: session.sparklesCollected,
        qudoBoostCollected: session.qudoBoostCollected,
        totalReward,
        duration: session.time,
        decorationsUnlocked: Math.floor(session.flowersCollected / 5),
    };
}
