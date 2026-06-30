const stats = [
    { id: 1, name: 'Partner Clinics', value: '28' },
    { id: 2, name: 'Plus Doctors', value: '2,000+' },
    { id: 3, name: 'Medical Departments', value: '120' },
  ]
  
  export default function Stats() {
    return (
      <div id="stats" className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-4">
                <dt className="text-base leading-7 text-foreground/80">{stat.name}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-primary sm:text-5xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    )
  }
  