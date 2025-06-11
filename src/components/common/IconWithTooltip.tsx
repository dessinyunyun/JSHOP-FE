// components/IconWithTooltip.tsx
import * as Tooltip from '@radix-ui/react-tooltip';
import { LucideIcon } from 'lucide-react';

interface IconWithTooltipProps {
  icon: LucideIcon;
  tooltipText: string;
  onClick?: () => void;
  iconClass?: string;
}

export default function IconWithTooltip({
  icon: Icon,
  tooltipText,
  onClick,
  iconClass = '',
}: IconWithTooltipProps) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className='p-2 rounded hover:bg-gray-100' onClick={onClick}>
            <Icon className={`w-5 h-5 ${iconClass}`} />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className='bg-gray-800 text-white px-2 py-1 rounded text-sm z-[999]'
            sideOffset={5}
          >
            {tooltipText}
            <Tooltip.Arrow className='fill-gray-800' />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
