import { signIn, useSession } from 'next-auth/react';
import styles from './styles.module.scss';
import { api } from '@/src/services/api';
import { getStripeJs } from '@/src/services/stripe-js';

interface SubscribeButtonProps {
  priceId: string;
}

// getServerSideProps (SSR)
// getStaticProps (SSG)
// API routes 
/**
 * 
 * Onde acesso o backend
 */

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data } = useSession();

  async function handleSubscribe() {
    if (!data) {
      signIn('github');
      return;
    }

    // CRIAÇÃO Checkou session
    try {
      const response = await api.post('/subscribe');
      const { sessionID } = response.data;

      const stripe = await getStripeJs();

      await stripe?.redirectToCheckout({ sessionId: sessionID })
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}