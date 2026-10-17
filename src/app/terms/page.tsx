import type { Metadata } from 'next';
import { Legal } from '@/components/sections/Legal';

export const metadata: Metadata = { title: 'Terms' };

export default function Terms() {
  return (
    <Legal
      title="Terms"
      items={[
        { h: 'About this site', p: 'This site is published by Foodies Hospitality, trading as Foodbiz, of [NEEDS CLIENT: address].' },
        { h: 'What is on it', p: 'The pages describe the kind of work we do. They are not a quote or an offer. Menus, prices and availability are agreed in writing for each event.' },
        { h: 'Sending a brief', p: 'Sending a brief starts a conversation. It does not create a booking or hold a date.' },
        { h: 'Photographs and marks', p: 'Photographs, text and marks belong to Foodies Hospitality or to the clients concerned. Third-party names identify work we have catered and remain the property of their owners.' },
        { h: 'Governing law', p: 'These terms are governed by the laws of India, and the courts at Mumbai have jurisdiction.' },
      ]}
    />
  );
}
