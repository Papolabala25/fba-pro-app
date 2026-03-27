export function generateProductsFromKeyword(keyword: string) {

  const base = keyword.toLowerCase()

  return [
    {
      name: `Smart ${base} Pro Kit`,
      margin: rand(60, 85),
      demand: rand(70, 95),
      competition: rand(40, 70),
      stability: rand(60, 85),
      volatility: rand(20, 50)
    },
    {
      name: `Portable ${base} System`,
      margin: rand(55, 80),
      demand: rand(65, 90),
      competition: rand(50, 75),
      stability: rand(55, 80),
      volatility: rand(25, 55)
    },
    {
      name: `${capitalize(base)} Elite Bundle`,
      margin: rand(65, 90),
      demand: rand(60, 85),
      competition: rand(45, 70),
      stability: rand(65, 90),
      volatility: rand(20, 40)
    },
    {
      name: `${capitalize(base)} Starter Pack`,
      margin: rand(40, 70),
      demand: rand(75, 95),
      competition: rand(60, 85),
      stability: rand(50, 75),
      volatility: rand(30, 60)
    }
  ]
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}