import { useState, useCallback } from 'react';

const useReviewModal = (apiEndpoint: string) => {
    const [reviews, setReviews] = useState<string[] | undefined>(undefined);
  const [storeName, setStoreName] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setReviews(undefined);
  }, []);

  const openModal = useCallback(async (storeId: number, storeName: string) => {
    closeModal();
    setStoreName(storeName);
    setIsModalOpen(true);

    const reviews = await fetchAIReviews(storeId);
    setReviews(reviews);
  }, [closeModal]);

  const fetchAIReviews = async (storeId: number): Promise<string[]> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${apiEndpoint}/review/${storeId}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('API response data:', data);

      if (data.statusCode === 204) {
        return ["가게에 대한 리뷰가 없습니다."];
      }

      if (data.data && typeof data.data === 'string') {
        return data.data.split('\n\n');
      } else {
        console.error('Unexpected API response format:', data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return ["리뷰를 불러오는 데 실패했습니다."];
    }
  };

  return {
    reviews,
    storeName,
    isModalOpen,
    openModal,
    closeModal,
  };
};

export default useReviewModal;
