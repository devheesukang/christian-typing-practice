export type PrayerVersion = "new" | "classic";

export const PRAYER_TEXTS: Record<PrayerVersion, string> = {
  new: `하늘에 계신 우리 아버지,
아버지의 이름을 거룩하게 하시며
아버지의 나라가 오게 하시며,
아버지의 뜻이 하늘에서와 같이
땅에서도 이루어지게 하소서.
오늘 우리에게 일용할 양식을 주시고,
우리가 우리에게 잘못한 사람을 용서하여 준 것 같이
우리 죄를 용서하여 주시고,
우리를 시험에 빠지지 않게 하시고
악에서 구하소서.
나라와 권능과 영광이
영원히 아버지의 것입니다. 아멘.`,
  classic: `하늘에 계신 우리 아버지여 이름이 거룩히 여김을 받으시오며
나라이 임하옵시며 뜻이 하늘에서 이룬 것 같이 땅에서도 이루어지이다
오늘날 우리에게 일용할 양식을 주옵시고
우리가 우리에게 죄 지은 자를 사하여 준것 같이 우리 죄를 사하여 주옵시고
우리를 시험에 들게 하지 마옵시고 다만 악에서 구하옵소서

나라와 권세와 영광이 아버지께 영원히 있사옵나이다 아멘`,
};

export const PRAYER_TITLES: Record<PrayerVersion, string> = {
  new: "새 주기도문",
  classic: "기존 개역한글",
};

export const PRAYER_DESCRIPTIONS: Record<PrayerVersion, string> = {
  new: "현대어 표기 신형 본문. 쉼표와 마침표는 자동 처리됩니다.",
  classic: "개역한글 원문에 가까운 전통형 본문.",
};
