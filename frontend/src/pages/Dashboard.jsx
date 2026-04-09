import { useMemo } from 'react';
import { Briefcase, CheckCircle2, Clock3, TrendingUp, XCircle } from 'lucide-react';
import { useApplications } from '../context/useApplications';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

const Dashboard = () => {
  const { applications, loading } = useApplications();

  const stats = useMemo(() => {
    const total = applications.length;
    const interviews = applications.filter((a) => a.status === 'Interview').length;
    const offers = applications.filter((a) => a.status === 'Offer').length;
    const rejections = applications.filter((a) => a.status === 'Rejected').length;
    const responded = interviews + offers + rejections;
    const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0;
    const active = total - offers - rejections;

    return { total, interviews, offers, rejections, responseRate, active };
  }, [applications]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-10 text-center text-foreground-muted shadow-sm">
        Loading dashboard...
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Applications',
      value: stats.total,
      icon: Briefcase,
      accent: '#3b82f6',
      soft: 'rgba(59, 130, 246, 0.14)',
      helper: 'Full pipeline volume',
    },
    {
      title: 'Active Pipeline',
      value: stats.active,
      icon: TrendingUp,
      accent: 'var(--color-primary)',
      soft: 'var(--color-primary-soft)',
      helper: 'Open opportunities now',
    },
    {
      title: 'Interviews',
      value: stats.interviews,
      icon: Clock3,
      accent: '#c27a12',
      soft: 'rgba(194, 122, 18, 0.14)',
      helper: 'Conversations in motion',
    },
    {
      title: 'Offers',
      value: stats.offers,
      icon: CheckCircle2,
      accent: '#15803d',
      soft: 'rgba(21, 128, 61, 0.16)',
      helper: 'Positive outcomes',
    },
    {
      title: 'Rejections',
      value: stats.rejections,
      icon: XCircle,
      accent: '#b91c1c',
      soft: 'rgba(185, 28, 28, 0.13)',
      helper: 'Learning checkpoints',
    },
  ];

  return (
    <div>
      <header className="page-header">
        <div>
          <p className="page-eyebrow">Overview</p>
          <h1 className="page-title">Dashboard & Insights</h1>
          <p className="page-subtitle">Measure momentum, improve response quality, and track outcomes.</p>
        </div>
      </header>

      <section className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="group"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <Card className="h-full animate-fade-up transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-lift">
                <CardContent className="flex h-full items-center gap-3 p-4">
                  <div className="rounded-xl p-2.5" style={{ background: card.soft, color: card.accent }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-[0.76rem] font-semibold uppercase tracking-wide text-foreground-subtle">
                      {card.title}
                    </p>
                    <p className="text-2xl font-extrabold leading-none">{card.value}</p>
                    <p className="mt-1 text-xs text-foreground-muted">{card.helper}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>Response Rate</CardTitle>
            <CardDescription>
              Share of applications that progressed to interview, offer, or rejection.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex items-end justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle">Current</span>
              <span className="text-3xl font-extrabold leading-none">{stats.responseRate}%</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${stats.responseRate}%`, transition: 'width 0.6s ease-out' }}
              />
            </div>

            <div className="mt-4 rounded-xl border border-border bg-background p-3 text-sm text-foreground-muted">
              {stats.total === 0
                ? 'No data yet. Add your first applications to unlock trends.'
                : stats.responseRate < 20
                  ? 'Healthy start. Refine each resume to the role to improve early callbacks.'
                  : stats.responseRate > 50
                    ? 'Excellent traction. Keep this quality bar and focus on deeper interview prep.'
                    : 'Solid pace. Iterate outreach and keep interview stories sharp.'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Quick Direction</CardTitle>
            <CardDescription>Simple guide based on your current mix.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-foreground-muted">
            <div className="rounded-xl border border-border bg-background p-3">
              Apply intentionally: quality applications usually outperform high-volume sprays.
            </div>
            <div className="rounded-xl border border-border bg-background p-3">
              When interviews rise, shift effort to mock responses and follow-up emails.
            </div>
            <div className="rounded-xl border border-border bg-background p-3">
              Track salary and notes consistently; they make negotiations and decisions easier.
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;
