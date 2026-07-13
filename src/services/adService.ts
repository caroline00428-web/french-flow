// ============================================================
// Ad Service — 微信小程序广告系统
// 在 Web 端用模拟广告，小程序端替换为真实广告组件
// ============================================================

// Check if running in WeChat Mini Program
export function isMiniProgram(): boolean {
  return typeof (window as any).wx !== 'undefined' && typeof (window as any).wx.createBannerAd === 'function';
}

// ============================================================
// Banner Ad
// ============================================================
export interface BannerAdConfig {
  adUnitId: string; // 微信广告单元ID
  style?: {
    left?: number;
    top?: number;
    width?: number;
  };
}

// Track ad impressions for frequency control
const adState = {
  lastInterstitial: 0,
  interstitialCount: 0,
  rewardedCount: 0,
  maxInterstitialsPerSession: 3,
  interstitialCooldown: 180_000, // 3 minutes between ads
};

// ============================================================
// Interstitial Ad — between lessons
// ============================================================
export function shouldShowInterstitial(): boolean {
  const now = Date.now();
  if (adState.interstitialCount >= adState.maxInterstitialsPerSession) return false;
  if (now - adState.lastInterstitial < adState.interstitialCooldown) return false;
  return true;
}

export async function showInterstitialAd(adUnitId: string): Promise<boolean> {
  if (!shouldShowInterstitial()) return false;

  return new Promise((resolve) => {
    if (isMiniProgram()) {
      // 真实小程序插屏广告
      const interstitialAd = (window as any).wx.createInterstitialAd({ adUnitId });
      interstitialAd.onLoad(() => interstitialAd.show());
      interstitialAd.onError(() => resolve(false));
      interstitialAd.onClose(() => {
        adState.lastInterstitial = Date.now();
        adState.interstitialCount++;
        resolve(true);
      });
    } else {
      // Web端模拟
      const closed = simulateAd('interstitial', '插屏广告 (小程序中为真实广告)');
      setTimeout(() => {
        adState.lastInterstitial = Date.now();
        adState.interstitialCount++;
        resolve(closed);
      }, 3000);
    }
  });
}

// ============================================================
// Rewarded Video Ad — watch to unlock
// ============================================================
export interface RewardedAdReward {
  type: 'gems' | 'xp' | 'unlock_lesson' | 'ad_free';
  amount?: number;
  lessonId?: string;
}

export async function showRewardedAd(
  adUnitId: string,
  reward: RewardedAdReward
): Promise<{ watched: boolean; reward: RewardedAdReward }> {
  return new Promise((resolve) => {
    if (isMiniProgram()) {
      const rewardedVideoAd = (window as any).wx.createRewardedVideoAd({ adUnitId });
      rewardedVideoAd.onLoad(() => rewardedVideoAd.show());
      rewardedVideoAd.onError(() => resolve({ watched: false, reward }));
      rewardedVideoAd.onClose((res: any) => {
        if (res && res.isEnded) {
          adState.rewardedCount++;
          resolve({ watched: true, reward });
        } else {
          resolve({ watched: false, reward });
        }
      });
    } else {
      // Web端模拟
      const watched = simulateAd('rewarded', `激励视频: 观看获得 ${reward.type === 'gems' ? `${reward.amount}💎` : reward.type === 'ad_free' ? '30分钟无广告' : '解锁内容'}`);
      setTimeout(() => {
        adState.rewardedCount++;
        resolve({ watched, reward });
      }, 4000);
    }
  });
}

// ============================================================
// Simulated ad for web testing
// ============================================================
function simulateAd(type: string, message: string): boolean {
  // Create a toast-like ad overlay for web testing
  const existing = document.getElementById('ad-sim-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'ad-sim-overlay';
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 99999;
    background: rgba(0,0,0,0.85); display: flex;
    flex-direction: column; align-items: center; justify-content: center;
    color: white; font-family: sans-serif;
  `;
  overlay.innerHTML = `
    <div style="background:#1a1a2e; padding:40px 30px; border-radius:20px; text-align:center; max-width:320px;">
      <div style="font-size:48px; margin-bottom:16px;">${type === 'rewarded' ? '🎬' : '📢'}</div>
      <div style="font-size:14px; font-weight:bold; margin-bottom:8px;">
        ${type === 'rewarded' ? '激励视频广告' : '插屏广告'}
      </div>
      <div style="font-size:12px; color:#999; margin-bottom:24px;">${message}</div>
      <div style="display:flex; gap:12px; justify-content:center;">
        <button id="ad-skip-btn" style="
          padding:10px 24px; border-radius:10px; border:none;
          background:#333; color:white; font-size:13px; cursor:pointer;
        ">跳过 (3s)</button>
        ${type === 'rewarded' ? `
        <button id="ad-watch-btn" style="
          padding:10px 24px; border-radius:10px; border:none;
          background:#58CC02; color:white; font-size:13px; font-weight:bold; cursor:pointer;
        ">观看完整广告 ✅</button>` : ''}
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  let countdown = 3;
  const skipBtn = overlay.querySelector('#ad-skip-btn')!;
  const timer = setInterval(() => {
    countdown--;
    if (countdown <= 0) {
      skipBtn.textContent = '关闭';
      skipBtn.removeAttribute('disabled');
      clearInterval(timer);
    } else {
      skipBtn.textContent = `跳过 (${countdown}s)`;
    }
  }, 1000);

  skipBtn.addEventListener('click', () => { overlay.remove(); });
  const watchBtn = overlay.querySelector('#ad-watch-btn');
  if (watchBtn) {
    watchBtn.addEventListener('click', () => { overlay.remove(); });
  }

  return !!watchBtn; // watched = true if there's a watch button (rewarded ad)
}

// ============================================================
// Banner ad placeholder (for bottom of screen)
// ============================================================
export function getBannerAdHeight(): number {
  return 60; // standard banner ad height
}

// Reset ad counters (call at start of new session)
export function resetAdCounters(): void {
  adState.interstitialCount = 0;
  adState.lastInterstitial = 0;
}
