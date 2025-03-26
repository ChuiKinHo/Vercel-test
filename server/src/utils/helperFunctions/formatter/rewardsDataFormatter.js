const rewardsDataFormatter = (rewards) => {
  const formattedRewardsData = rewards?.map((reward) => {
    return {
      rewardId: reward?._id,
      category: reward?.category,
      name_en: reward?.name_en,
      name_zh: reward?.name_zh,
      quantity: reward?.quantity,
      required_coins: reward?.required_coins,
      image: reward?.image,
      user: reward?.user,
    };
  });
  return formattedRewardsData;
};

export default rewardsDataFormatter;
