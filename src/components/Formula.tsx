type Props = {
  eq: string
  note?: string
}

export function Formula({ eq, note }: Props) {
  return (
    <div className="formula">
      <code>{eq}</code>
      {note ? <small>{note}</small> : null}
    </div>
  )
}
