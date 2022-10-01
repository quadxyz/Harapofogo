import { Accordion, Avatar, Center, Divider, Grid, Group, LoadingOverlay, Skeleton, Stack, Text } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { apiCall } from "../components/api";

const Route = ({ item, set, val, currOp }: { item: any, set: any, val: any, currOp: any }) => {
    const [data, setData] = useState()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (currOp != val) { setOpen(false) }
    }, [currOp])

    return (<Accordion.Item className="dimmed" mb="md" value={val} sx={{ boxShadow: '5px 5px 3px rgba(0, 0, 0, .25)' }}>
        <Accordion.Control disabled={open && !data} onClick={() => {
            setOpen(!open)
            if (open) {
                set(0)
            } else {
                set(val)
            }
            if (!data) { apiCall("POST", "/api/exposition", { runs: item.kifejtes_postjson.runs, nativeData: item.nativeData }).then((e) => { setData(e); if (open) set(val) }) }
        }}>
            <Stack spacing={0}>
                <Grid>
                    <Grid.Col sx={{ position: 'relative' }} span="auto">
                        {!item.nativeData[0].FromBay ? <></> :
                            <Avatar variant="outline" m={10} radius="xl" size={26} sx={{ position: 'absolute', top: 0, left: 0 }}>{item.nativeData[0].FromBay}</Avatar>}
                        <Text align="center" size="xl">{item.indulasi_ido}</Text>
                        <Text align="center" size="sm">{item.indulasi_hely}</Text>
                    </Grid.Col>
                    <Grid.Col span="auto">
                        <Text align="center" size="xl">{item.erkezesi_ido}</Text>
                        <Text align="center" size="sm">{item.erkezesi_hely}</Text>
                    </Grid.Col>
                </Grid>
                <Divider size="lg" my={6} />
                <Text align="center">{item.atszallasok_szama} átszállás {item.riskyTransfer ? <IconAlertTriangle size={15} stroke={2} color="yellow" /> : <></>}</Text>
                <Group position="center" spacing='sm'>
                    <Text size="sm">{item.osszido}</Text>
                    <Text size="sm">{new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(item.totalFare)}</Text>
                    <Text size="sm">{item.ossztav}</Text>
                </Group>
            </Stack>
        </Accordion.Control>
        <Accordion.Panel>
            <Skeleton visible={!data} sx={{ width: '100%' }} height={200} radius="lg">
                {JSON.stringify(data)}
            </Skeleton>
        </Accordion.Panel>
    </Accordion.Item>)
}

const Routes: NextPage = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState<any>(null)
    const [results, setResults] = useState<any>(null)
    const [accordion, setAccordion] = useState<any>()

    useEffect(() => {
        setLoading(true)
        setQuery({
            from: Number(router.query['f'] as string),
            to: Number(router.query['t'] as string),
            hours: Number(router.query['h'] as string),
            minutes: Number(router.query['m'] as string),
            date: router.query['d'] as string
        })
    }, [router])

    useEffect(() => {
        if (query) {
            apiCall("POST", "/api/routes", query).then(resp => { if (resp.status === 'success') { setResults(resp); setLoading(false) } })
        }
    }, [query])

    return (<>
        <Head>
            <title>Menetrendek</title>
        </Head>
        <LoadingOverlay visible={loading} />
        <Accordion value={accordion} chevron={<></>} chevronSize={0} radius="lg" variant="filled" >
            {results ?
                Object.keys(results.results.talalatok).map(key => {
                    const item = results.results.talalatok[key]
                    return (<Route set={setAccordion} currOp={accordion} val={key} key={key} item={item} />)
                }
                ) : <></>}
        </Accordion>
    </>)
}

export default Routes