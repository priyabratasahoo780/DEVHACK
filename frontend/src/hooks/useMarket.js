import { useState } from 'react';
import { getMarketPrediction, getMandiComparison } from '../services/marketApi';
import toast from 'react-hot-toast';

export function useMarket() {
  const [prediction, setPrediction] = useState(null);
  const [mandiData, setMandiData] = useState(null);
  const [loading, setLoading] = useState(false);

  const predictPrice = async (data) => {
    setLoading(true);
    try {
      const result = await getMarketPrediction(data);
      // interceptor already strips response.data, so result = { success, data, message }
      setPrediction(result.data || result);
      toast.success('Market prediction ready!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const compareMandis = async (data) => {
    setLoading(true);
    try {
      const result = await getMandiComparison(data);
      setMandiData(result.data || result);
      toast.success('Mandi comparison ready!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { prediction, mandiData, loading, predictPrice, compareMandis };
}
