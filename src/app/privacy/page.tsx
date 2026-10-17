import type { Metadata } from 'next';
import { Legal } from '@/components/sections/Legal';

export const metadata: Metadata = { title: 'Privacy' };

export default function Privacy() {
  return (
    <Legal
      title="Privacy"
      items={[
        { h: 'What we collect', p: 'On this preview, nothing. The blueprint builds your brief in your own browser. Nothing leaves your device unless you copy it and send it yourself.' },
        { h: 'What we do with a brief you send us', p: 'We use it to reply to you, quote for your event and plan it. We do not sell it, rent it, or pass it to anyone outside Foodbiz.' },
        { h: 'Cookies and tracking', p: 'This site sets no cookies and runs no advertising or tracking scripts. Our host keeps standard server logs for security and reliability.' },
        { h: 'Photographs', p: 'The photographs on this site are from events we have catered. If you appear in one and would rather not, write to us and we will take it down.' },
        { h: 'Getting in touch', p: 'Questions about any of this: [NEEDS CLIENT: enquiry email].' },
      ]}
    />
  );
}
