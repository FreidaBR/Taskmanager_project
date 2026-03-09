import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'priorityColor', standalone: true })
export class PriorityColorPipe implements PipeTransform {
  transform(priority: string): string {
    const colors: Record<string, string> = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#10b981'
    };
    return colors[priority] || '#6b7280';
  }
}

@Pipe({ name: 'statusColor', standalone: true })
export class StatusColorPipe implements PipeTransform {
  transform(status: string): string {
    const colors: Record<string, string> = {
      pending: '#6b7280',
      in_progress: '#3b82f6',
      completed: '#10b981'
    };
    return colors[status] || '#6b7280';
  }
}

@Pipe({ name: 'categoryIcon', standalone: true })
export class CategoryIconPipe implements PipeTransform {
  transform(category: string): string {
    const icons: Record<string, string> = {
      Work: '💼', Personal: '🏠', Health: '💪', Learning: '📚', Other: '🗂️'
    };
    return icons[category] || '📋';
  }
}

@Pipe({ name: 'daysUntil', standalone: true })
export class DaysUntilPipe implements PipeTransform {
  transform(dateStr: string): string {
    if (!dateStr) return '';
    const diff = Math.ceil((new Date(dateStr).getTime() - new Date().getTime()) / 86400000);
    if (diff === 0) return 'Today';
    if (diff > 0) return `${diff}d left`;
    return `${Math.abs(diff)}d ago`;
  }
}