import { getBannerAdHeight } from '../services/adService';

// Banner ad placeholder — in WeChat Mini Program, this renders a real banner ad
// In web mode, shows a subtle placeholder
interface Props {
  adUnitId?: string; // WeChat ad unit ID
  compact?: boolean;
}

export default function BannerAd({ compact = false }: Props) {
  // In real mini program: use wx.createBannerAd()
  // For web: show a subtle CTA that matches the ad experience
  return (
    <div
      className="w-full bg-white border-t border-gray-100 flex items-center justify-center"
      style={{ height: compact ? 36 : getBannerAdHeight(), minHeight: compact ? 36 : 50 }}
    >
      <div className="flex items-center gap-3 px-4 opacity-60">
        <div className="w-6 h-6 rounded bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-[10px]">
          📢
        </div>
        <div className="flex-1">
          <div className="text-[11px] text-gray-400">广告位 · 支持我们免费运营</div>
        </div>
        <span className="text-[9px] text-gray-300 bg-gray-100 px-1.5 py-0.5 rounded">广告</span>
      </div>
    </div>
  );
}
