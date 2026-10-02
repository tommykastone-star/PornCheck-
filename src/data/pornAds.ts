import { MediaFile, BrowseMode } from '../types';

export interface PornAdMetadata {
  id: string;
  name: string;
  sponsorName: string;
  adTitle: string;
  description: string;
  ctaText: string;
  targetUrl: string;
  videoUrl: string;
  thumbnailColor: string;
  badge: 'HOT SPONSOR' | 'FEATURED AD' | 'SPECIAL OFFER' | 'PREMIUM PROMO' | 'CAM STREAM AD' | 'GAME SPONSOR';
  mode: BrowseMode;
}

export const AVAILABLE_PORN_ADS: PornAdMetadata[] = [
  {
    id: 'ad_livecams_vip',
    name: 'livecams_hd_vip_stream.mp4',
    sponsorName: 'LiveFlirt HD',
    adTitle: 'Live 1-on-1 Interactive Private HD Cams',
    description: 'Connect with verified live performers instantly in private interactive video sessions.',
    ctaText: 'Watch Live Now',
    targetUrl: 'https://example.com/cams',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailColor: '#d97706',
    badge: 'CAM STREAM AD',
    mode: 'manual',
  },
  {
    id: 'ad_vr_pass',
    name: 'vr_sensual_immersion_promo.mp4',
    sponsorName: 'SinVR Studio',
    adTitle: 'Ultra 8K Virtual Reality & POV Experiences',
    description: 'Immerse in hyper-realistic 3D binaural adult adventures compatible with any headset or phone.',
    ctaText: 'Claim Free VR Pass',
    targetUrl: 'https://example.com/vr',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailColor: '#7c3aed',
    badge: 'HOT SPONSOR',
    mode: 'manual',
  },
  {
    id: 'ad_game_quest',
    name: 'harem_odyssey_interactive_ad.mp4',
    sponsorName: 'CyberClimax Games',
    adTitle: 'Harem Odyssey - 3D Adult RPG Game',
    description: 'Play the #1 interactive adult dating sim and visual story game. Uncensored choices & realistic physics.',
    ctaText: 'Play Free in Browser',
    targetUrl: 'https://example.com/games',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailColor: '#db2777',
    badge: 'GAME SPONSOR',
    mode: 'manual',
  },
  {
    id: 'ad_pass_unlimited',
    name: 'black_diamond_club_ad.mp4',
    sponsorName: 'Black Diamond Pass',
    adTitle: 'Unlimited Studio Cinema Pass & 4K Downloads',
    description: 'Access 50,000+ full-length cinematic adult films with zero buffering and offline download rights.',
    ctaText: 'Unlock 70% Off Today',
    targetUrl: 'https://example.com/pass',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnailColor: '#b45309',
    badge: 'PREMIUM PROMO',
    mode: 'manual',
  },
  {
    id: 'ad_ai_hentai_live',
    name: 'ai_anime_cyber_companion.mp4',
    sponsorName: 'NeuroHentai AI',
    adTitle: 'AI Interactive Cyber Waifus & 3D Anime Companions',
    description: 'Generate real-time AI anime voice, custom scenes, and responsive anime animations dynamically.',
    ctaText: 'Generate Free AI Girl',
    targetUrl: 'https://example.com/ai-anime',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailColor: '#6366f1',
    badge: 'FEATURED AD',
    mode: 'ai',
  },
  {
    id: 'ad_ai_deep_companion',
    name: 'ai_sensual_companion_voice.mp4',
    sponsorName: 'SynthLover AI',
    adTitle: 'Hyper-Realistic AI Voice & Visual Adult Chat',
    description: 'Talk, flirt and exchange photo stills with neural AI models customized to your preferences.',
    ctaText: 'Start Free AI Chat',
    targetUrl: 'https://example.com/ai-chat',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnailColor: '#ea580c',
    badge: 'SPECIAL OFFER',
    mode: 'ai',
  },
];

/**
 * Creates high-quality procedural animated video / canvas blobs for the ads
 * so they can be previewed, played in HTML5 player, and saved directly to the database.
 */
export async function createAdMediaFile(ad: PornAdMetadata): Promise<MediaFile> {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 360;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Rich background
    const grad = ctx.createLinearGradient(0, 0, 640, 360);
    grad.addColorStop(0, '#211510');
    grad.addColorStop(0.5, ad.thumbnailColor);
    grad.addColorStop(1, '#0c0705');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 360);

    // Decorative glowing geometric shapes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, 600, 320);

    // Badge pill
    ctx.fillStyle = '#c86d3b';
    ctx.beginPath();
    ctx.roundRect(40, 35, 140, 26, 13);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(ad.badge, 110, 52);

    // Sponsor
    ctx.fillStyle = '#e2a049';
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`SPONSOR: ${ad.sponsorName.toUpperCase()}`, 40, 95);

    // Ad Title
    ctx.fillStyle = '#f7ede8';
    ctx.font = 'bold 24px system-ui, sans-serif';
    ctx.fillText(ad.adTitle, 40, 135);

    // Description text
    ctx.fillStyle = '#bfa59a';
    ctx.font = '14px system-ui, sans-serif';
    ctx.fillText(ad.description.substring(0, 55) + '...', 40, 175);

    // Call to Action button
    ctx.fillStyle = '#c86d3b';
    ctx.beginPath();
    ctx.roundRect(40, 240, 200, 46, 23);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`▶  ${ad.ctaText}`, 140, 269);

    // Watermark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('PORNCHECK ADS NETWORK • 18+', 600, 320);
  }

  // Convert canvas to image dataUrl
  const dataUrl = canvas.toDataURL('image/jpeg', 0.88);

  return {
    id: `ad_${ad.id}_${Date.now()}`,
    name: `[AD] ${ad.adTitle}.mp4`,
    type: 'video/mp4',
    category: 'Porn Videos',
    size: 4.8 * 1024 * 1024,
    addedAt: Date.now(),
    mode: ad.mode,
    url: ad.videoUrl, // Hosted MP4 streaming clip
    dataUrl: dataUrl,
    isPornAd: true,
    tags: ['porn-ad', 'commercial', ad.sponsorName.toLowerCase(), 'sponsor'],
    comments: [
      {
        id: `c_${Date.now()}`,
        userName: ad.sponsorName,
        userEmail: 'sponsor@network.ad',
        text: `Official advertisement sponsor: ${ad.description} Visit: ${ad.targetUrl}`,
        createdAt: Date.now() - 3600000,
      },
    ],
    uploaderName: ad.sponsorName,
    uploaderEmail: 'ads@porncheck.network',
  };
}
